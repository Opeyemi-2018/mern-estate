import Listing from '../models/listingModel.js'
import { errorHandler } from '../utils/error.js'
export let createListing = async (req, res, next) => {
    try {
        let listing = await Listing.create(req.body)
        return res.status(201).json(listing)
    } catch (error) {
        next(error)
    }
}

export let deleteListing = async (req, res, next) => {
    let listing = await Listing.findById(req.params.id)
    if(!listing){
        return next(errorHandler(404, 'Listing not found!'))
    }
    if(req.user.id !== listing.userRef){
        return next(errorHandler(401, 'you can only delete your own listings!'))
    }
    try {
        await Listing.findByIdAndDelete(req.params.id)
        res.status(200).json('Listing has been deleted!');
    } catch (error) {
        next(error)
    }
}

export let updateListing = async (req, res, next) => {
    let listing = await Listing.findById(req.params.id)
    if(!listing){
        return next(errorHandler(401, 'listing not found!'))
    }
    if(req.user.id !== listing.userRef){
        return next(errorHandler(401, 'you can only update your own listing'))
    }

    try {
        let updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        )
        res.status(200).json(updatedListing)
    } catch (error) {
        next(error)
    }
} 

export let getListing = async (req, res, next) => {
    try {
        let listing = await Listing.findById(req.params.id)
        if(!listing){
            return next(errorHandler(401, 'listing not found'))
        }
        res.status(200).json(listing)
    } catch (error) {
        next(error)
    }
}