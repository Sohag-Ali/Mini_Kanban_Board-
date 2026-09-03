import httpStatus from 'http-status'
import { AppError } from '../../utils/appError'
import { ICreateTaskPayload, IMoveTaskPayload, IUpdateTaskPayload } from './task.interface'

const validateText = (value: unknown, field: string, required: boolean) => {
	if (value === undefined && !required) {
		return undefined
	}

	if (typeof value !== 'string') {
		throw new AppError(httpStatus.BAD_REQUEST, `${field} must be a string`)
	}

	const text = value.trim()

	if (required && !text) {
		throw new AppError(httpStatus.BAD_REQUEST, `${field} is required`)
	}

	if (text.length > (field === 'title' ? 200 : 2000)) {
		throw new AppError(httpStatus.BAD_REQUEST, `${field} is too long`)
	}

	return text
}

export const validateCreateTask = (payload: unknown): ICreateTaskPayload => {
	if (!payload || typeof payload !== 'object') {
		throw new AppError(httpStatus.BAD_REQUEST, 'Invalid task data')
	}

	const body = payload as Record<string, unknown>
	const title = validateText(body.title, 'title', true)
	const description = validateText(body.description, 'description', false)

	return { title: title as string, description }
}

export const validateUpdateTask = (payload: unknown): IUpdateTaskPayload => {
	if (!payload || typeof payload !== 'object') {
		throw new AppError(httpStatus.BAD_REQUEST, 'Invalid task data')
	}

	const body = payload as Record<string, unknown>
	const allowedFields = ['title', 'description']
	const hasUnexpectedField = Object.keys(body).some(field => !allowedFields.includes(field))

	if (hasUnexpectedField || Object.keys(body).length === 0) {
		throw new AppError(httpStatus.BAD_REQUEST, 'Only title and description can be updated')
	}

	const title = validateText(body.title, 'title', false)
	const description = body.description === null
		? null
		: validateText(body.description, 'description', false)

	return {
		...(title !== undefined && { title }),
		...(body.description !== undefined && { description }),
	}
}

export const validateMoveTask = (payload: unknown): IMoveTaskPayload => {
	if (!payload || typeof payload !== 'object') {
		throw new AppError(httpStatus.BAD_REQUEST, 'Invalid move data')
	}

	const body = payload as Record<string, unknown>

	if (typeof body.targetColumnId !== 'string' || !body.targetColumnId.trim()) {
		throw new AppError(httpStatus.BAD_REQUEST, 'targetColumnId is required')
	}

	if (typeof body.targetPosition !== 'number' || !Number.isInteger(body.targetPosition) || body.targetPosition < 0) {
		throw new AppError(httpStatus.BAD_REQUEST, 'targetPosition must be a non-negative integer')
	}

	if (Object.keys(body).some(field => field !== 'targetColumnId' && field !== 'targetPosition')) {
		throw new AppError(httpStatus.BAD_REQUEST, 'Only targetColumnId and targetPosition are allowed')
	}

	return {
		targetColumnId: body.targetColumnId.trim(),
		targetPosition: body.targetPosition,
	}
}