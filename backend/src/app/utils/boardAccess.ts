import httpStatus from 'http-status'
import { BoardRole } from '../../generated/prisma/client'
import { prisma } from '../lib/prisma'
import { AppError } from './appError'

export async function assertBoardAccess(userId: string, boardId: string) {
  const board = await prisma.board.findUnique({
    where: { id: boardId },
    select: { id: true, ownerId: true },
  })

  if (!board) {
    throw new AppError(httpStatus.NOT_FOUND, 'Board not found')
  }

  if (board.ownerId === userId) {
    return { board, role: BoardRole.OWNER }
  }

  const membership = await prisma.boardMember.findUnique({
    where: { boardId_userId: { boardId, userId } },
    select: { role: true },
  })

  if (!membership) {
    throw new AppError(httpStatus.FORBIDDEN, 'You do not have access to this board')
  }

  return { board, role: membership.role }
}

export async function assertBoardOwner(userId: string, boardId: string) {
  const access = await assertBoardAccess(userId, boardId)

  if (access.role !== BoardRole.OWNER) {
    throw new AppError(httpStatus.FORBIDDEN, 'Only the board owner can perform this action')
  }

  return access.board
}

export async function assertBoardMutationAccess(userId: string, boardId: string) {
  const access = await assertBoardAccess(userId, boardId)

  if (access.role === BoardRole.VIEWER) {
    throw new AppError(httpStatus.FORBIDDEN, 'Viewers cannot modify this board')
  }

  return access
}
