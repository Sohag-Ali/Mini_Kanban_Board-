import { Router } from 'express'

import { auth } from '../../middleware/checkAuth'
import { UserController } from './user.controller'

const router = Router()

router.get('/search', auth(), UserController.searchUsers)

export const UserRoutes = router
