import httpStatus from 'http-status'
import { prisma } from '../../lib/prisma'
import { assertBoardOwner } from '../../utils/boardAccess'
import { AppError } from '../../utils/appError'

interface SearchUsersOptions {
  search: string
  limit: number
  boardId: string
}

const searchEligibleUsers = async (
  requesterId: string,
  { search, limit, boardId }: SearchUsersOptions,
) => {
  await assertBoardOwner(requesterId, boardId)

  if (!boardId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Board ID is required')
  }

  const normalizedSearch = search.trim()
  const safeLimit = Math.min(Math.max(limit || 5, 1), 5)

  return prisma.user.findMany({
    where: {
      id: { not: requesterId },
      status: 'ACTIVE',
      isDeleted: false,
      memberships: {
        none: { boardId },
      },
      OR: [
        { name: { contains: normalizedSearch, mode: 'insensitive' } },
        { email: { contains: normalizedSearch, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: { name: 'asc' },
    take: safeLimit,
  })
}

export const UserService = {
  searchEligibleUsers,
}
