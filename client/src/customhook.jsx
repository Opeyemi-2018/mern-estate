import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const useFavorite = (listingId) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;

  // Function to fetch user's favorite listings
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) return; // Ensure user is authenticated before making the request

      try {
        const res = await fetch("/api/favorite/user-favorites", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch favorites");
        }

        const favorites = await res.json();
        setIsFavorite(favorites.some((fav) => fav.listing._id === listingId));
      } catch (error) {
        toast.error(error.message || "An error occurred");
      }
    };

    fetchFavorites();
  }, [listingId, token]);

  // Function to add listing to favorites
  const addToFavorite = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/favorite/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ listingId }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || "Something went wrong");
        setLoading(false);
        return;
      }

      localStorage.setItem(listingId, "true");
      toast.success("Added to favorites");
      setIsFavorite(true);

      // Notify other components that favorite status has changed
      window.dispatchEvent(new Event("favorite-updated"));
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Function to delete listing from favorites
  const deleteFavorite = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/favorite/favorites/${listingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || "Something went wrong");
        setLoading(false);
        return;
      }

      localStorage.removeItem(listingId);
      toast.success("Removed from favorite");
      setIsFavorite(false);

      // Notify other components that favorite status has changed
      window.dispatchEvent(new Event("favorite-updated"));
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { isFavorite, loading, addToFavorite, deleteFavorite };
};

export default useFavorite;
