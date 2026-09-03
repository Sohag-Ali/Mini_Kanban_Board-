import httpStatus from 'http-status'
import { BoardRole, Prisma } from '../../../generated/prisma/client'
import { prisma } from '../../lib/prisma'
import { AppError } from '../../utils/appError'
import { ICreateTaskPayload, IMoveTaskPayload, IUpdateTaskPayload } from './task.interface'

const assertColumnAccess = async (userId: string, columnId: string) => {
	const column = await prisma.column.findUnique({
		where: { id: columnId },
		select: {
			id: true,
			board: { select: { id: true, ownerId: true } },
		},
	})

	if (!column) {
		throw new AppError(httpStatus.NOT_FOUND, 'Column not found')
	}

	if (column.board.ownerId === userId) {
		return { column, role: BoardRole.OWNER }
	}

	const membership = await prisma.boardMember.findUnique({
		where: {
			boardId_userId: {
				boardId: column.board.id,
				userId,
			},
		},
		select: { role: true },
	})

	if (!membership) {
		throw new AppError(httpStatus.FORBIDDEN, 'You do not have access to this board')
	}

	return { column, role: membership.role }
}

const assertMutationAccess = async (userId: string, columnId: string) => {
	const access = await assertColumnAccess(userId, columnId)

	if (access.role === BoardRole.VIEWER) {
		throw new AppError(httpStatus.FORBIDDEN, 'Viewers cannot modify tasks')
	}

	return access
}

const create = async (userId: string, columnId: string, payload: ICreateTaskPayload) => {
	await assertMutationAccess(userId, columnId)

	try {
		return await prisma.$transaction(async tx => {
			const lastTask = await tx.task.aggregate({
				where: { columnId },
				_max: { position: true },
			})

			return tx.task.create({
				data: {
					title: payload.title,
					description: payload.description,
					columnId,
					position: (lastTask._max.position ?? -1) + 1,
				},
			})
		})
	} catch (_error) {
		throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create task')
	}
}

const findAll = async (userId: string, columnId: string) => {
	await assertColumnAccess(userId, columnId)

	return prisma.task.findMany({
		where: { columnId },
		orderBy: { position: 'asc' },
	})
}

const findOne = async (userId: string, columnId: string, taskId: string) => {
	await assertColumnAccess(userId, columnId)

	const task = await prisma.task.findFirst({
		where: { id: taskId, columnId },
	})

	if (!task) {
		throw new AppError(httpStatus.NOT_FOUND, 'Task not found')
	}

	return task
}

const update = async (
	userId: string,
	columnId: string,
	taskId: string,
	payload: IUpdateTaskPayload,
) => {
	await assertMutationAccess(userId, columnId)
	await findOne(userId, columnId, taskId)

	try {
		return await prisma.task.update({
			where: { id: taskId },
			data: payload,
		})
	} catch (_error) {
		throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to update task')
	}
}

const remove = async (userId: string, columnId: string, taskId: string) => {
	await assertMutationAccess(userId, columnId)
	await findOne(userId, columnId, taskId)

	try {
		return await prisma.$transaction(async tx => {
			const deletedTask = await tx.task.delete({ where: { id: taskId } })
			const remainingTasks = await tx.task.findMany({
				where: { columnId },
				orderBy: { position: 'asc' },
				select: { id: true },
			})

			for (const [position, task] of remainingTasks.entries()) {
				await tx.task.update({
					where: { id: task.id },
					data: { position },
				})
			}

			return deletedTask
		})
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
			throw new AppError(httpStatus.NOT_FOUND, 'Task not found')
		}

		throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to delete task')
	}
}

const move = async (
	userId: string,
	columnId: string,
	taskId: string,
	payload: IMoveTaskPayload,
) => {
	const sourceAccess = await assertMutationAccess(userId, columnId)
	const task = await prisma.task.findFirst({
		where: { id: taskId, columnId },
	})

	if (!task) {
		throw new AppError(httpStatus.NOT_FOUND, 'Task not found')
	}

	const targetColumn = await prisma.column.findUnique({
		where: { id: payload.targetColumnId },
		select: { id: true, boardId: true },
	})

	if (!targetColumn) {
		throw new AppError(httpStatus.NOT_FOUND, 'Target column not found')
	}

	if (targetColumn.boardId !== sourceAccess.column.board.id) {
		throw new AppError(httpStatus.FORBIDDEN, 'You cannot move a task to another board')
	}

	try {
		return await prisma.$transaction(async tx => {
			if (columnId === payload.targetColumnId) {
				const taskCount = await tx.task.count({ where: { columnId } })
				const targetPosition = Math.min(payload.targetPosition, taskCount - 1)

				if (task.position === targetPosition) {
					return task
				}

				if (targetPosition < task.position) {
					await tx.task.updateMany({
						where: {
							columnId,
							position: { gte: targetPosition, lt: task.position },
						},
						data: { position: { increment: 1 } },
					})
				} else {
					await tx.task.updateMany({
						where: {
							columnId,
							position: { gt: task.position, lte: targetPosition },
						},
						data: { position: { decrement: 1 } },
					})
				}

				return tx.task.update({
					where: { id: taskId },
					data: { position: targetPosition },
				})
			}

			const targetTaskCount = await tx.task.count({
				where: { columnId: payload.targetColumnId },
			})
			const targetPosition = Math.min(payload.targetPosition, targetTaskCount)

			await tx.task.updateMany({
				where: { columnId, position: { gt: task.position } },
				data: { position: { decrement: 1 } },
			})

			await tx.task.updateMany({
				where: {
					columnId: payload.targetColumnId,
					position: { gte: targetPosition },
				},
				data: { position: { increment: 1 } },
			})

			return tx.task.update({
				where: { id: taskId },
				data: {
					columnId: payload.targetColumnId,
					position: targetPosition,
				},
			})
		})
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
			throw new AppError(httpStatus.NOT_FOUND, 'Task not found')
		}

		throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to move task')
	}
}

export const TaskService = { create, findAll, findOne, update, remove, move }