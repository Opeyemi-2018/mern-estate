import express from 'express'
import {test, updateUser} from '../controllers/userController.js'
import { verifyToken } from '../utils/verifyUser.js'

let router = express.Router()

router.get('/test', test)
router.post('/update/:id', verifyToken, updateUser)

export default router