import httpStatus from 'http-status'
import { Request, Response } from 'express'

import { catchAsync } from '../../utils/catchAsync'
import { AppError } from '../../utils/appError'
import { sendResponse } from '../../utils/sendResponse'
import { UserService } from './user.service'

const searchUsers = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User information is missing in the request')
  }

  const search = typeof req.query.search === 'string' ? req.query.search : ''
  const boardId = typeof req.query.boardId === 'string' ? req.query.boardId : ''
  const parsedLimit = typeof req.query.limit === 'string' ? Number(req.query.limit) : 5

  if (!boardId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Board ID is required')
  }

  const users = await UserService.searchEligibleUsers(req.user.userId, {
    search,
    boardId,
    limit: Number.isFinite(parsedLimit) ? parsedLimit : 5,
  })

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Eligible users fetched successfully',
    data: users,
  })
})

export const UserController = {
  searchUsers,
}
