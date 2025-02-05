import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { MdOutlineFavoriteBorder, MdFavorite } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeroImage from "../assets/images/hero-image.jpeg";
import Count from "../component/Count";

const Rent = () => {
  const [rents, setRent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedApartmentType, setSelectedApartmentType] = useState("");
  const [filteredListings, setFilteredListings] = useState([]);

  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites"));
    return savedFavorites || {};
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
        setFilteredListings(data); // Set all listings as default
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRentListing();
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleAddToFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: true }));
  };

  const handleDeleteFavorite = (id) => {
    setFavorites((prev) => {
      const updatedFavorites = { ...prev };
      delete updatedFavorites[id];
      return updatedFavorites;
    });
  };

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/states"
        );
        const data = await response.json();
        const usa = data.data.find(
          (country) =>
            country.name.toLowerCase() === "united states" ||
            country.name.toLowerCase() === "usa"
        );
        if (usa) {
          setStates(usa.states);
        }
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    fetchStates();
  }, []);

  const handleSearch = () => {
    const filtered = rents.filter(
      (rent) =>
        (selectedState ? rent.state === selectedState : true) &&
        (selectedApartmentType
          ? rent.apartmentType === selectedApartmentType
          : true)
    );

    if (filtered.length === 0) {
      toast.error("No matching listing");
      setFilteredListings(rents); // Show all listings if no match
    } else {
      setFilteredListings(filtered);
    }
  };

  return (
    <div className="min-h-screen relative">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        toastClassName="w-[250px] text-center"
      />

      <div
        className="relative w-full h-[200px] flex items-center flex-col gap-10 justify-center 
        bg-black/80 bg-blend-darken transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${HeroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-white p-4 mx-2 rounded-md">
          <div className="flex items-center gap-3">
            <p>Filter by</p>

            <div className="flex items-center">
              <select
                id="apartmentType"
                className="w-full p-2 bg-gray-50 outline-none rounded-sm shadow-sm"
                value={selectedApartmentType}
                onChange={(e) => setSelectedApartmentType(e.target.value)}
              >
                <option value="">Select Apartment Type</option>
                <option value="Bungalow">Bungalow</option>
                <option value="Duplex">Duplex</option>
                <option value="Mansion">Mansion</option>
                <option value="Semi-Detached House">Semi-Detached House</option>
                <option value="Story Building">Story Building</option>
                <option value="Detached House">Detached House</option>
                <option value="Cottage">Cottage</option>
                <option value="Terraced House">Terraced House</option>
              </select>

              <p className="w-1 h-10 bg-gray-600"></p>

              <select
                id="state"
                className="p-2 w-full bg-gray-50 outline-none rounded-sm shadow-sm"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <option value="">-- Choose a state --</option>
                {states.map((state, index) => (
                  <option key={index} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            className="p-2 rounded-full float-end text-white mt-2 bg-black"
            onClick={handleSearch}
          >
            Search
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
            {filteredListings.map((rent) => {
              const {
                imageUrls,
                name,
                regularPrice,
                _id,
                bathrooms,
                bedrooms,
              } = rent;

              const isFavorite = favorites[_id] || false;

              return (
                <div className="shadow-md relative" key={_id}>
                  <Link to={`/listing/${_id}`}>
                    <img
                      src={imageUrls[0] || "default-image-url.jpg"}
                      className="h-[200px] w-full object-cover sm:rounded-md"
                      alt={name}
                    />
                  </Link>

                  <div className="rounded-md md:py-1 py-2 md:px-2 px-4">
                    <div className="flex items-center justify-between mt-3">
                      <h1 className="text-gray-700">{name.slice(0, 20)}</h1>
                      <h1 className="text-gray-700">${regularPrice}</h1>
                    </div>
                    <div className="flex items-center justify-between mt-2">
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
      <Count />
    </div>
  );
};

export default Rent;
