import httpStatus from 'http-status'
import { Prisma } from '../../../generated/prisma/client'
import { prisma } from '../../lib/prisma'
import { AppError } from '../../utils/appError'
import { assertBoardAccess, assertBoardOwner } from '../../utils/boardAccess'
import { ICreateBoardPayload, IUpdateBoardPayload } from './boards.interface'


const create = async (
  userId: string,
  createBoardDto: ICreateBoardPayload,
) => {
  const owner = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  })

  if (!owner) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Authenticated user not found',
    )
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const board = await tx.board.create({
        data: {
          name: createBoardDto.name,
          ownerId: userId,
        },
      })

      await tx.boardMember.create({
        data: {
          boardId: board.id,
          userId: userId,
          role: 'OWNER',
        },
      })

      return board
    })

    return result
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new AppError(
        httpStatus.CONFLICT,
        'A board with this name already exists',
      )
    }

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create board',
    )
  }
}

const findAll = async (userId: string) => {
    return prisma.board.findMany({
        where: {
          OR: [
            { ownerId: userId },
            { members: { some: { userId } } },
          ],
        },
        orderBy: { createdAt: 'desc' },
    })
}

const findShared = async (userId: string) => {
  const memberships = await prisma.boardMember.findMany({
    where: {
      userId,
      board: { ownerId: { not: userId } },
    },
    orderBy: { board: { updatedAt: 'desc' } },
    select: {
      role: true,
      board: {
        select: {
          id: true,
          name: true,
          ownerId: true,
          createdAt: true,
          updatedAt: true,
          owner: { select: { id: true, name: true, email: true } },
        },
      },
    },
  })

  return memberships.map(({ board, role }) => ({ ...board, role }))
}

const findOne = async (userId: string, boardId: string) => {
  const access = await assertBoardAccess(userId, boardId)
  return prisma.board.findUniqueOrThrow({ where: { id: access.board.id } })
}

const update = async (
    userId: string,
    boardId: string,
    updateBoardDto: IUpdateBoardPayload,) => {
    await assertBoardOwner(userId, boardId)

    try {
        return await prisma.board.update({
            where: { id: boardId },
            data: {
                name: updateBoardDto.name,
            },
        })
    } catch (_error) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to update board')
    }
}

const remove = async (userId: string, boardId: string) => {
    await assertBoardOwner(userId, boardId)

    try {
        return await prisma.board.delete({
            where: { id: boardId },
        })
    } catch (_error) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to delete board')
    }
}





export const BoardsService = {
    create,
    findAll,
    findShared,
    findOne,
    update,
    remove,
}
