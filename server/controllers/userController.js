import bcryptjs from 'bcryptjs'
import User from '../models/userModel.js'
import { errorHandler } from '../utils/error.js'

export let test = (req, res) => {
    res.json({msg: 'hello world'})
}

export let updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) 
        return next(errorHandler(401, "You can only update your own account"))

    try {
        if(req.body.password){
         req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }

        let updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set:{
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            }
        }, {new: true})

        let {password, ...rest} = updatedUser._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

//4: 25