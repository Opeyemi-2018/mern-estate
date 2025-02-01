import mongoose from "mongoose";
// Define the schema for a Favorite model
const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model, this will reference the user who favorites the listing
      required: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing", // Assuming you have a Listing model, this will reference the listing the user favorited
      required: true,
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields automatically
  }
);

export const Favorite = mongoose.model("Favorite", favoriteSchema);
