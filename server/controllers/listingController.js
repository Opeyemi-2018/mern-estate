import Listing from '../models/listingModel.js'
export let createListing = async (req, res, next) => {
    try {
        let listing = await Listing.create(req.body)
        return res.status(201).json(listing)
    } catch (error) {
        next(error)
    }
}
