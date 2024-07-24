import bcryptjs from 'bcryptjs'
import User from '../models/userModel.js'
import { errorHandler } from '../utils/error.js'
import Listing from '../models/listingModel.js'

export let test = (req, res) => {
    res.json({msg: 'hello world'})
}

// Export the updateUser function to be used in other parts of the application
export let updateUser = async (req, res, next) => {
    // Check if the ID of the authenticated user matches the ID in the request parameters
    if(req.user.id !== req.params.id) 
        // If IDs do not match, call the error handler with a 401 status and message
        return next(errorHandler(401, "You can only update your own account"));

    try {
        // If a new password is provided in the request body
        if(req.body.password){
            // Hash the new password using bcryptjs with a salt of 10
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        // Find the user by ID and update their information
        let updatedUser = await User.findByIdAndUpdate(req.params.id, {
            // Set the new values for username, email, and password
            $set:{
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            }
        }, {new: true}); // Return the updated document

        // Destructure the updatedUser object to exclude the password field
        let {password, ...rest} = updatedUser._doc;
        // Respond with the updated user information, excluding the password
        res.status(200).json(rest);
    } catch (error) {
        // If any error occurs, pass it to the next middleware for handling
        next(error);
    }
};

export let deleteUser = async (req, res, next) => {
    // Check if the user is trying to delete their own account
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can only delete your own account'));
    }

    try {
        // Attempt to find and delete the user by ID
        await User.findByIdAndDelete(req.params.id);
        
        // Clear the access token cookie
        res.clearCookie('access_token');
        
        // Send a success response
        res.status(200).json('User has been deleted');
    } catch (error) {
        // Pass any errors to the error handler
        next(error);
    }
};

export const getUserListings = async (req, res, next) => {
    if (req.user.id === req.params.id) { // Check if the logged-in user's ID matches the ID in the request parameters
      try {
        const listings = await Listing.find({ userRef: req.params.id }); // Fetch listings from the database where the userRef matches the ID in the request parameters
        res.status(200).json(listings); // Send the listings as a JSON response with a status code of 200 (OK)
      } catch (error) {
        next(error); // If an error occurs during the database query, pass the error to the next middleware (usually an error handler)
      }
    } else {
      return next(errorHandler(401, 'You can only view your own listings!')); // If the logged-in user’s ID does not match the ID in the request parameters, return a 401 Unauthorized error
    }
};
  

export const getUser = async (req, res, next) => {
    try {
      // Find the user by ID from the request parameters
      const user = await User.findById(req.params.id);
  
      // If the user is not found, pass an error to the next middleware
      if (!user) return next(errorHandler(404, 'User not found!'));
  
      // Destructure the user document to exclude the password field
      const { password: pass, ...rest } = user._doc;
  
      // Send a JSON response with the user data (excluding the password)
      res.status(200).json(rest);
    } catch (error) {
      // If an error occurs, pass it to the next middleware
      next(error);
    }
  };
  