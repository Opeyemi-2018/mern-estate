import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { Link } from "react-router-dom";
import { MdFavorite } from "react-icons/md";
import HeroImage from "../assets/images/hero-image.jpeg";
import { MdKeyboardArrowDown } from "react-icons/md";

const Rent = () => {
  const [rents, setRent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showType, setShowType] = useState(false);
  const [showAll, setShowAll] = useState(false);
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
    <div className="min-h-screen relative">
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

      <div className="absolute md:top-36 top-44 md:left-28 left-6 rounded-md z-20 bg-white shadow-lg p-5">
        <div className="flex gap-4 items-center mb-3">
          <p>filter by </p>
          <p
            onClick={() => {
              setShowLocation((prev) => !prev);
              setShowType(false);
            }}
            className="font-semibold cursor-pointer text-[19px]"
          >
            location
          </p>
          <p
            onClick={() => {
              setShowType((prev) => !prev);
              setShowLocation(false);
            }}
            className="font-semibold cursor-pointer text-[19px]"
          >
            type
          </p>

          <p
            onClick={() => setShowAll(!showAll)}
            className="font-semibold cursor-pointer text-[19px]"
          >
            All
          </p>
          {/* <MdKeyboardArrowDown size={25} /> */}
        </div>
        <div className="flex  gap-2 flex-col">
          <div>
            <select
              id="location"
              className={`${
                showType ? "inline" : "hidden"
              }  w-full p-2 border border-gray-300 outline-none rounded-md`}
            >
              <option value="" disabled>
                Select Apartment Type
              </option>
              <option value="Bungalow">Bungalow</option>
              <option value="Duplex">Duplex</option>
              <option value="Mansion">Mansion</option>
              <option value="Semi-Detached House">Semi-Detached House</option>
              <option value="Story Building">Story Building</option>
              <option value="Detached House">Detached House</option>
              <option value="Cottage">Cottage</option>
              <option value="Terraced House">Terraced House</option>
            </select>

            <select
              id="apartmentType"
              className={`${
                showLocation ? "inline" : "hidden"
              } p-2 w-full border border-gray-300 outline-none rounded-md`}
            >
              <option value="" disabled>
                location
              </option>
              <option value="">location</option>
            </select>
          </div>
          <button className="p-2 rounded-full w-full text-white bg-black">
            search
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="spinner mt-20 flex items-center justify-center">
          <ClipLoader color="blue" size={50} loading={isLoading} />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto my-6">
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
