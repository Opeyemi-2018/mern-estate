import User from "../models/userModel.js"
import bcryptjs from 'bcryptjs'

export let signUp = async (req, res, next) => {
   
    let { username, email, password } = req.body
    let hashPassword = bcryptjs.hashSync(password, 10)
    let newUser = new User({username, email, password: hashPassword})
    try {
        await newUser.save()
        res.status(201).json('user created successfully')
    } catch (error) {
        next(error)
    }
   
}