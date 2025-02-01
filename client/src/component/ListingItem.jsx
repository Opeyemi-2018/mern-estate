import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { MdOutlineFavoriteBorder } from "react-icons/md";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import { useState } from "react";
import { useSelector } from "react-redux";

/**
 * ListingItem component displays individual listing information.
 * @param {Object} listing - The listing object containing details about the property.
 * @returns JSX element for rendering a listing item.
 */
export default function ListingItem({ listing }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const addToFavorite = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const res = await fetch("/api/favorite/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ listingId: listing._id }),
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || "something went wrong", {
          pauseOnHover: false,
          draggable: true,
        });
        setLoading(false);
        return;
      }
      toast.success("successfully added to favorite", {
        pauseOnHover: false,
        draggable: true,
      });
      setIsFavorite(true);
      setLoading(false);
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred", {
        pauseOnHover: false,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-md w-full sm:w-[330px]">
      <div className="absolute left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
        <ToastContainer position="top-center" autoClose={5000} />
      </div>{" "}
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageUrls[0] ||
            "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
          }
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
      </Link>
      <div className="p-3 flex flex-col gap-2 w-full">
        <p className="truncate text-lg font-semibold text-slate-700">
          {listing.name}
        </p>
        <div className="flex items-center gap-1">
          <MdLocationOn className="h-4 w-4 text-green-700" />
          <p className="text-sm text-gray-600 truncate w-full">
            {listing.address}
          </p>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">
          {listing.description}
        </p>
        <p className="text-slate-500 mt-2 font-semibold ">
          $
          {listing.offer
            ? listing.discountPrice.toLocaleString("en-US")
            : listing.regularPrice.toLocaleString("en-US")}
          {listing.type === "rent" && " / month"}
        </p>
        <div className="flex items-center justify-between">
          <div className="text-slate-700 flex items-center gap-4">
            <div className="font-bold text-xs">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds `
                : `${listing.bedrooms} bed `}
            </div>

            <div className="font-bold text-xs">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths `
                : `${listing.bathrooms} xxxxxxxxxxxx bath `}
            </div>
          </div>
          <div>
            {loading ? (
              <div className="spinner  flex items-center justify-center">
                <ClipLoader color="blue" size={25} loading={loading} />
              </div>
            ) : (
              <MdOutlineFavoriteBorder
                onClick={addToFavorite}
                size={25}
                className=" z-10 text-gray-500"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
