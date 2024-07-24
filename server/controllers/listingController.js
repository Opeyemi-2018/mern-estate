import Listing from '../models/listingModel.js'
import { errorHandler } from '../utils/error.js'
export let createListing = async (req, res, next) => {
    try {
        // Attempt to execute the following code block and handle any errors that occur.
        let listing = await Listing.create(req.body);
        // Wait for the `Listing.create` method to complete, which creates a new listing in the database
        // using the data provided in `req.body`. `await` ensures that the code execution pauses
        // until the promise returned by `Listing.create` resolves.
        
        return res.status(201).json(listing);
        // If the creation is successful, send an HTTP response with status code 201 (Created)
        // and include the newly created listing object as a JSON response body.
    } catch (error) {
        // If an error occurs in the try block, execute this catch block.
        next(error);
        // Pass the error to the next middleware function in the stack, which typically handles errors
        // and sends an appropriate response to the client. This ensures that errors are handled in a
        // centralized manner, improving maintainability and consistency.
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

// Import necessary dependencies
export let getListing = async (req, res, next) => {
    // Begin a try block to handle potential errors
    try {
        // Attempt to find a listing in the database using the ID provided in the request parameters
        let listing = await Listing.findById(req.params.id);

        // If no listing is found, handle the error
        if (!listing) {
            // Pass an error to the next middleware indicating that the listing was not found
            return next(errorHandler(401, 'listing not found'));
        }

        // If a listing is found, respond with a 200 status and the listing data in JSON format
        res.status(200).json(listing);
    } catch (error) {
        // If any error occurs during the process, pass the error to the next middleware
        next(error);
    }
};


export const getListings = async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit) || 9;
      const startIndex = parseInt(req.query.startIndex) || 0;
      let offer = req.query.offer;
  
      if (offer === undefined || offer === 'false') {
        offer = { $in: [false, true] };
      }
  
      let furnished = req.query.furnished;
  
      if (furnished === undefined || furnished === 'false') {
        furnished = { $in: [false, true] };
      }
  
      let parking = req.query.parking;
  
      if (parking === undefined || parking === 'false') {
        parking = { $in: [false, true] };
      }
  
      let type = req.query.type;
  
      if (type === undefined || type === 'all') {
        type = { $in: ['sale', 'rent'] };
      }
  
      const searchTerm = req.query.searchTerm || '';
  
      const sort = req.query.sort || 'createdAt';
  
      const order = req.query.order || 'desc';
  
      const listings = await Listing.find({
        name: { $regex: searchTerm, $options: 'i' },
        offer,
        furnished,
        parking,        
        type,
      })
        .sort({ [sort]: order })
        .limit(limit)
        .skip(startIndex);
  
      return res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  };

  //*8: 41