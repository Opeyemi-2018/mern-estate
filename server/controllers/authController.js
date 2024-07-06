import User from "../models/userModel.js"
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {errorHandler} from '../utils/error.js'

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

export let signIn = async (req, res, next) => {
    let {email, password} = req.body
    try {
        let validUser = await User.findOne({email})
        if(!validUser) return next(errorHandler(404, "User not found"))
        let validPassword = bcryptjs.compareSync(password, validUser.password)
        if(!validPassword) return next(errorHandler(401, 'Wrong credentials'))
        
        let token = jwt.sign({ id: validUser._id}, process.env.JWT_SECRET);
        let {password: pass, ...rest} = validUser._doc
        res.cookie('access_token', token, {httpOnly: true})
        .status(200)
        .json(rest)
    } catch (error) {
        next(error)
    }
}

export let google = async (req, res, next) => {
    try {
        let user = await User.findOne({email: req.body.email})
        if(user) {
            let token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
            let {password: pass, ...rest} = user._doc
            res.cookie('access_token', token, {httpOnly: true})
            .status(200)
            .json(rest)
        } else{
            let generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            let hashPassword = bcryptjs.hashSync(generatedPassword, 10)
            let newUser = new User({username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4), email: req.body.email, password: hashPassword, avatar: req.body.photo })
            newUser.save()
            let token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET)
            let {password: pass, ...rest} = newUser._doc;
            res.cookie('access_token', token, {httpOnly: true})
            .status(200).json(rest)
        }
    } catch (error) {
        next(error)
    }
}  

//3: 19

 

