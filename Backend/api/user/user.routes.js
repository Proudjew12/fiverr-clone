import express from 'express'

import { getUsers,getUser,updateUser,deleteUser } from './user.controller.js'

export const userRoutes = express.Router()

userRoutes.get('/', getUsers)
userRoutes.get('/:userId', getUser)
userRoutes.put('/:userId', updateUser)
userRoutes.delete('/:userId',deleteUser)