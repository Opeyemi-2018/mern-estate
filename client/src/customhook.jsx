import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const useFavorite = (listingId) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;

  // Check if the listing is already a favorite on initial load
  useEffect(() => {
    const savedFavorite = localStorage.getItem(listingId);
    if (savedFavorite) {
      setIsFavorite(true);
    }
  }, [listingId]);

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
        toast.error(errorData.message || "Something went wrong", {
          pauseOnHover: false,
          draggable: true,
        });
        setLoading(false);
        return;
      }

      // Persist the favorite status in localStorage
      localStorage.setItem(listingId, "true");

      toast.success("Successfully added to favorites", {
        pauseOnHover: false,
        draggable: true,
      });
      setIsFavorite(true);
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred", {
        pauseOnHover: false,
        draggable: true,
      });
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
        toast.error(errorData.message || "Something went wrong", {
          pauseOnHover: false,
          draggable: true,
        });
        setLoading(false);
        return;
      }

      // Remove the favorite status from localStorage
      localStorage.removeItem(listingId);

      toast.success("Successfully removed from favorites", {
        pauseOnHover: false,
        draggable: true,
      });
      setIsFavorite(false);
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred", {
        pauseOnHover: false,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return { isFavorite, loading, addToFavorite, deleteFavorite };
};

export default useFavorite;
