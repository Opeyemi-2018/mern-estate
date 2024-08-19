import express from 'express'
import { createListing, deleteListing, updateListing, getListing, getListings } from '../controllers/listingController.js'
import { verifyToken } from '../utils/verifyUser.js'

// Example authentication middleware
const authenticateUser = (req, res, next) => {
    // Assume user is authenticated and req.user is populated
    // This is just a placeholder example
    req.user = {
      id: 'userId',
      isAdmin: true,  // or false
      isAgent: true   // or false
    };
    next();
  };
  

let router = express.Router()

router.post('/create', verifyToken, authenticateUser, createListing)
router.delete('/delete/:id', verifyToken, deleteListing)
router.post('/update/:id', verifyToken, updateListing)
router.get('/get/:id',  getListing)
router.get('/get', getListings)
export default router