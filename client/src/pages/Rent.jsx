import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { Link } from "react-router-dom";
import { MdFavorite } from "react-icons/md";
import HeroImage from "../assets/images/hero-image.jpeg";

const Rent = () => {
  const [rents, setRent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize favorites state from localStorage
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites"));
    return savedFavorites || {}; // If no favorites in localStorage, start with an empty object
  });

  useEffect(() => {
    const fetchRentListing = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/listing/get?type=rent");
        if (!res.ok) {
          throw new Error("Unable to fetch");
        }
        const data = await res.json();
        setRent(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRentListing();
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Function to handle adding to favorites
  const handleAddToFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: true }));
  };

  // Function to handle deleting from favorites
  const handleDeleteFavorite = (id) => {
    setFavorites((prev) => {
      const updatedFavorites = { ...prev };
      delete updatedFavorites[id]; // Remove from favorites
      return updatedFavorites;
    });
  };

  return (
    <div className="min-h-screen">
      <div
        className={`relative w-full h-[200px] flex items-center flex-col gap-10 justify-center 
                bg-black/80 bg-blend-darken transition-all duration-1000 ease-in-out`}
        style={{
          backgroundImage: `url(${HeroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex px-3 items-center text-white justify-center flex-col gap-3 my-10">
          <h1 className="text-3xl">Here are numerous properties to Let</h1>
          <button className="p-3 bg-red-600 border-white border-2 text-white hover:bg-red-700 rounded-full">
            Contact an agent today!!
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="spinner mt-20 flex items-center justify-center">
          <ClipLoader color="blue" size={50} loading={isLoading} />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto my-6">
          <h1 className="sm:text-3xl px-3 text-2xl py-4 text-[#1E2128]">
            To Let Property
          </h1>
          <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
            {rents.map((rent) => {
              const {
                imageUrls,
                name,
                regularPrice,
                _id,
                bathrooms,
                bedrooms,
              } = rent;

              const isFavorite = favorites[_id] || false; // Check if it's a favorite

              return (
                <div className="shadow-md relative" key={_id}>
                  <Link to={`/listing/${_id}`}>
                    <img
                      src={imageUrls[0] || "default-image-url.jpg"} // Add a fallback for missing images
                      className="h-[200px] w-full object-cover sm:rounded-md"
                      alt={name}
                    />
                  </Link>

                  <div className="rounded-md md:p-1 p-2">
                    <div className="flex items-center justify-between mt-3">
                      <h1 className="text-gray-700">{name.slice(0, 20)}</h1>
                      <h1 className="text-gray-700">${regularPrice}</h1>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-slate-700 flex items-center gap-4">
                        <div className="font-bold text-xs">
                          {bedrooms > 1
                            ? `${bedrooms} beds `
                            : `${bedrooms} bed `}
                        </div>

                        <div className="font-bold text-xs">
                          {bathrooms > 1
                            ? `${bathrooms} baths `
                            : `${bathrooms} bath `}
                        </div>
                      </div>

                      {isFavorite ? (
                        <MdFavorite
                          size={25}
                          onClick={() => handleDeleteFavorite(_id)}
                          className="text-pink-600 cursor-pointer"
                        />
                      ) : (
                        <MdOutlineFavoriteBorder
                          size={25}
                          onClick={() => handleAddToFavorite(_id)}
                          className="text-gray-500"
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Rent;
