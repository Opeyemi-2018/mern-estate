import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createFavorite,
  getUserFavorites,
  DeleteFavorite,
} from "../controllers/favoriteListingController.js";

const router = express.Router();

// Add a favorite listing
router.post("/favorites", verifyToken, createFavorite);
router.get("/get-favorites", verifyToken, getUserFavorites);
router.delete("/favorites/:listingId", verifyToken, DeleteFavorite);

export default router;
