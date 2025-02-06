import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { RiDeleteBin5Line } from "react-icons/ri";

const SavedListing = () => {
  const [favorites, setFavorite] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch favorites data
  useEffect(() => {
    const fetchFavorite = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/favorite/get-favorites", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Something went wrong");
        }

        const data = await res.json();
        setIsLoading(false);
        setFavorite(data);
      } catch (error) {
        setIsLoading(false);
        toast.error(error.message || "An unexpected error occurred", {
          pauseOnHover: false,
          draggable: true,
        });
      }
    };
    fetchFavorite();
  }, []);

  // Function to remove a favorite listing
  const removeFavorite = async (listingId) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/favorite/favorites/${listingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Unable to remove from favorites");
      }

      // Remove from localStorage
      localStorage.removeItem(listingId);

      // Remove from local state
      setFavorite((prevFavorites) =>
        prevFavorites.filter((favorite) => favorite.listing._id !== listingId)
      );

      // Notify other components that favorite status has changed
      window.dispatchEvent(new Event("favorite-updated"));

      toast.success("Removed from favorites", {
        pauseOnHover: false,
        draggable: true,
      });
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred", {
        pauseOnHover: false,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="spinner mt-20 flex items-center justify-center">
        <ClipLoader color="blue" size={50} isLoading={isLoading} />
      </div>
    );
  }

  return (
    <div className="px-3">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        toastClassName="w-[250px] text-center"
      />

      {favorites.length === 0 ? (
        <div className="text-2xl flex flex-col items-center justify-center pt-10 font-semibold my-5">
          <p>No Saved Items</p>
          <Link
            to={"/"}
            className="md:text-2xl text-xl underline text-blue-400"
          >
            Explore some nice listings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {favorites.map((favorite) => {
            const { imageUrls, name, regularPrice, _id } = favorite.listing;
            return (
              <div key={_id} className="flex flex-col gap-1 relative group">
                <div className="relative">
                  <button
                    onClick={() => removeFavorite(_id)}
                    className="bg-red-600 z-10 text-white rounded-full p-1 absolute right-2 top-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                  >
                    <RiDeleteBin5Line size={25} />
                  </button>
                </div>
                <Link to={`/listing/${_id}`} className="flex flex-col gap-1">
                  <img
                    src={imageUrls[0]}
                    alt={name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="flex items-center justify-between px-5">
                    <p>{name}</p>
                    <p>${regularPrice}</p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedListing;
