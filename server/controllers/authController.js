import User from "../models/userModel.js"; // Import the User model from the models directory
import bcryptjs from 'bcryptjs'; // Import bcryptjs for password hashing
import jwt from 'jsonwebtoken'; // Import jwt for token generation
import { errorHandler } from '../utils/error.js'; // Import a custom error handler utility

// Sign-up controller function
export let signUp = async (req, res, next) => {
    let { username, email, password } = req.body; // Destructure username, email, and password from the request body
    let hashPassword = bcryptjs.hashSync(password, 10); // Hash the password using bcryptjs with a salt rounds of 10
    let newUser = new User({ username, email, password: hashPassword }); // Create a new User instance with hashed password

    try {
        await newUser.save(); // Attempt to save the new user to the database
        res.status(201).json('User created successfully'); // Send a success response with status code 201
    } catch (error) {
        next(error); // Pass any error to the next middleware (error handler)
    }   
}

// Sign-in controller function
export let signIn = async (req, res, next) => {
    let { email, password } = req.body; // Destructure email and password from the request body

    try {
        let validUser = await User.findOne({ email }); // Find a user by email in the database
        if (!validUser) return next(errorHandler(404, "User not found")); // If user is not found, pass an error to the next middleware

        let validPassword = bcryptjs.compareSync(password, validUser.password); // Compare the provided password with the stored hashed password
        if (!validPassword) return next(errorHandler(401, 'Wrong credentials')); // If the password is incorrect, pass an error to the next middleware

        let token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET); // Generate a JWT token with the user's ID and secret key from environment variables
        let { password: pass, ...rest } = validUser._doc; // Exclude the password from the user object to be sent in the response

        res.cookie('access_token', token, { httpOnly: true }) // Set the token in an HTTP-only cookie
           .status(200) // Set the response status code to 200
           .json(rest); // Send the user data (excluding password) in the response
    } catch (error) {
        next(error); // Pass any error to the next middleware (error handler)
    }
}

// Google sign-in controller function
export let google = async (req, res, next) => {
    try {
        let user = await User.findOne({ email: req.body.email }); // Find a user by email in the database

        if (user) {
            // If user exists, generate a token and send the user data (excluding password) in the response
            let token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET); // Generate a JWT token with the user's ID and secret key from environment variables
            let { password: pass, ...rest } = user._doc; // Exclude the password from the user object to be sent in the response

            res.cookie('access_token', token, { httpOnly: true }) // Set the token in an HTTP-only cookie
               .status(200) // Set the response status code to 200
               .json(rest); // Send the user data (excluding password) in the response
        } else {
            // If user does not exist, create a new user with a randomly generated password
            let generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8); // Generate a random password
            let hashPassword = bcryptjs.hashSync(generatedPassword, 10); // Hash the generated password

            let newUser = new User({
                // Generate a unique username
                username: req.body.name.split(" ").join("").toLowerCase() // Take the user's name from the request body, split it by spaces, join it back without spaces, and convert it to lowercase
                + Math.random().toString(36).slice(-4), // Generate a random base-36 string and take the last 4 characters to ensure uniqueness
                email: req.body.email, // Use the provided email
                password: hashPassword, // Use the hashed password
                avatar: req.body.photo // Use the provided photo as the avatar
            });

            await newUser.save(); // Save the new user to the database

            let token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET); // Generate a JWT token with the new user's ID and secret key from environment variables
            let { password: pass, ...rest } = newUser._doc; // Exclude the password from the new user object to be sent in the response

            res.cookie('access_token', token, { httpOnly: true }) // Set the token in an HTTP-only cookie
               .status(200) // Set the response status code to 200
               .json(rest); // Send the new user data (excluding password) in the response
        }
    } catch (error) {
        next(error); // Pass any error to the next middleware (error handler)
    }
}

// Sign-out controller function
// export const signOut = async (req, res, next) => {
//     try {
//         res.clearCookie('access_token'); // Clear the 'access_token' cookie
//         res.status(200).json('User has been logged out!'); // Send a success response with status code 200
//     } catch (error) {
//         next(error); // Pass any error to the next middleware (error handler)
//     }
// };

export const signOut = async (req, res, next) => {
    try {
      res.clearCookie('access_token');
      res.status(200).json('User has been logged out!');
    } catch (error) {
      next(error);
      console.log(error);
      
    }
};
