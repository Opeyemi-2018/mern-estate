import express from 'express'
import {signUp} from '../controllers/authController.js'

let router = express.Router()

router.post('/signup', signUp)

export default router

