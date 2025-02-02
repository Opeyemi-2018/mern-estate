import { Favorite } from "../models/favoriteListingModel.js";
import { errorHandler } from "../utils/error.js";
import { Listing } from "../models/listingModel.js";

export const createFavorite = async (req, res, next) => {
  try {
    const { listingId } = req.body;
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    // Check if the listing exists (optional)
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const favorite = new Favorite({
      user: userId,
      listing: listingId,
    });

    await favorite.save();

    res.status(201).json({ message: "Listing added to favorites" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const DeleteFavorite = async (req, res, next) => {
  const { listingId } = req.params;
  const userId = req.user.id;

  try {
    const deletedFavorite = await Favorite.findOneAndDelete({
      user: userId,
      listing: listingId,
    });

    if (!deletedFavorite) {
      return next(errorHandler(404, "favorite not found"));
    }

    res.status(200).json({ message: "Favorite removed" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
