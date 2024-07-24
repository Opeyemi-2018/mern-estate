import express from 'express'
import {test, updateUser, deleteUser, getUserListings, getUser} from '../controllers/userController.js'
import { verifyToken } from '../utils/verifyUser.js'

let router = express.Router()

router.get('/test', test)
router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/listing/:id', verifyToken, getUserListings)
router.get('/:id', verifyToken, getUser)
export default router