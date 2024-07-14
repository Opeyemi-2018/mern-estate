import bcryptjs from 'bcryptjs'
import User from '../models/userModel.js'
import { errorHandler } from '../utils/error.js'
import Listing from '../models/listingModel.js'

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

export let deleteUser = async (req, res, next) => {
    if(req.user.id !== req.params.id)
        return next(errorHandler(401, 'You can only delete your own account'))
    try {
        await User.findByIdAndDelete(req.params.id)
        res.clearCookie('access_token')
        res.status(200).json('User has been deleted')
    } catch (error) {
        next(error)
    }
}

export let getUserListings = async (req, res, next) => {
    if(req.user.id === req.params.id){
        try {
            let listings = await Listing.find({userRef: req.params.id});
            res.status(200).json(listings)
        } catch (error) {
            
        }
    } else {
        return next(errorHandler(401, 'you can only view your own listing'))
    }
}

