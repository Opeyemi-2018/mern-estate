import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import ListingsLandLordInfo from "../component/ListingsLandlordInfo";
import { MdOutlinePermContactCalendar } from "react-icons/md";

// Function to fetch coordinates from the address using Nominatim API
const fetchCoordinates = async (address) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${address}&format=json&addressdetails=1&limit=1`
  );
  const data = await response.json();
  if (data && data[0]) {
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
    };
  }
  return null;
};

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userInfo, setUserInfo] = useState(false);
  const [cancelInfo, setCancelInfo] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // To store the selected image
  const [coordinates, setCoordinates] = useState(null);
  const { listingId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        const coords = await fetchCoordinates(data.address);
        setCoordinates(coords);
        setLoading(false);
        setError(false);
        setSelectedImage(data.imageUrls[0]);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [listingId]);

  useEffect(() => {
    // Ensure the map recalculates on coordinates update
    if (coordinates) {
      window.dispatchEvent(new Event("resize"));
    }
  }, [coordinates]);

  const handleShowMessage = () => {
    setCancelInfo(true);
    setUserInfo(false);
  };

  return (
    <main className="min-h-screen flex flex-col justify-between">
      {loading && (
        <div className="spinner my-40 flex flex-col gap-6 items-center justify-center">
          <ClipLoader color="blue" size={50} loading={loading} />
          <p>please wait a minute</p>
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center flex-col mt-10">
          <p className="text-center my-7 text-2xl flex-grow">
            Something went wrong!
          </p>
          <button
            className="bg-[#001030] p-3 rounded-md text-white "
            onClick={() => window.location.reload()}
          >
            Refresh page
          </button>
        </div>
      )}
      {listing && !loading && !error && (
        <div className="">
          <div className="flex items-center lg:flex-row flex-col gap-4 md:pt-3 max-w-6xl md:px-3 px-0 mx-auto">
            <div className="flex-1">
              <img
                src={selectedImage}
                alt=""
                className="w-full lg:h-[460px] h-[400px] lg:rounded-md object-cover" // Setting width and height with object-cover
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex flex-row lg:flex-col md:gap-4 gap-2">
              {listing.imageUrls.map((url, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(url)}
                  className={`lg:w-40 md:w-32 w-16 h-20 cursor-pointer  `}
                >
                  <img
                    src={url}
                    alt=""
                    className={` lg:w-full w-[340px] h-full object-cover rounded-md ${
                      selectedImage === url
                        ? "border-gray-400  border-2"
                        : "border-none"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="max-w-6xl mx-auto px-3 my-4">
            <div className="flex xl:flex-row flex-col gap-4">
              <div className="flex flex-col gap-4 md:mb-0 mb-4">
                <p className="md:text-2xl text-nowrap text-[18px] font-semibold">
                  {listing.name} - ${" "}
                  {listing.offer
                    ? listing.discountPrice.toLocaleString("en-US")
                    : listing.regularPrice.toLocaleString("en-US")}
                  {listing.type === "rent" && " / month"}
                </p>
                <p className="flex items-center md:mt-6 mt-3 gap-2 text-slate-600 text-sm">
                  <FaMapMarkerAlt className="text-green-700" />
                  {listing.address}
                </p>
                <div className="flex gap-4">
                  <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                    {listing.type === "rent" ? "For Rent" : "For Sale"}
                  </p>
                  {listing.offer && (
                    <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                      ${+listing.regularPrice - +listing.discountPrice} OFF
                    </p>
                  )}
                </div>
                <p className="text-slate-800">
                  <span className="font-semibold text-black">
                    Description -{" "}
                  </span>
                  {listing.description} loacted in {listing.state}
                </p>
                <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
                  <li className="flex items-center gap-1 whitespace-nowrap">
                    <FaBed className="text-lg" />
                    {listing.bedrooms > 1
                      ? `${listing.bedrooms} beds `
                      : `${listing.bedrooms} bed `}
                  </li>
                  <li className="flex items-center gap-1 whitespace-nowrap">
                    <FaBath className="text-lg" />
                    {listing.bathrooms > 1
                      ? `${listing.bathrooms} baths `
                      : `${listing.bathrooms} bath `}
                  </li>
                  <li className="flex items-center gap-1 whitespace-nowrap">
                    <FaParking className="text-lg" />
                    {listing.parking ? "Parking spot" : "No Parking"}
                  </li>
                  <li className="flex items-center gap-1 whitespace-nowrap">
                    <FaChair className="text-lg" />
                    {listing.furnished ? "Furnished" : "Unfurnished"}
                  </li>
                </ul>
                {!currentUser && listing.userRef !== currentUser && (
                  <div>
                    <p>
                      Kindly{" "}
                      <span>
                        <Link to="/sign-in" className="text-blue-500 underline">
                          sign in here
                        </Link>
                      </span>{" "}
                      to access the chat with this property owner.
                    </p>
                  </div>
                )}

                <div className="xl:flex  hidden mt-4">
                  {currentUser &&
                    listing.userRef !== currentUser._id &&
                    !userInfo && (
                      <button
                        onClick={() => setUserInfo(true)}
                        className="text-black underline flex items-center gap-3 font-semibold my-4 uppercase"
                      >
                        Contact landlord{" "}
                        <MdOutlinePermContactCalendar size={20} />
                      </button>
                    )}
                  {userInfo && !cancelInfo && (
                    <div className="fixed inset-0  sm:px-0 px-2 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                      <ListingsLandLordInfo
                        listing={listing}
                        setCancelInfo={setCancelInfo}
                        handleShowMessage={handleShowMessage}
                      />{" "}
                    </div>
                  )}
                </div>
              </div>

              {isLoaded && coordinates && coordinates.lat && coordinates.lon && (
                <div style={{ height: "400px", width: "100%" }}>
                  <GoogleMap
                    center={{ lat: coordinates.lat, lng: coordinates.lon }}
                    zoom={13}
                    mapContainerStyle={{ height: "100%", width: "100%" }}
                  >
                    <Marker
                      position={{ lat: coordinates.lat, lng: coordinates.lon }}
                    />
                  </GoogleMap>
                </div>
              )}
            </div>
            {/* button for mobile screen */}
            <div className="xl:hidden inline  ">
              {currentUser && listing.userRef !== currentUser._id && !userInfo && (
                <button
                  onClick={() => setUserInfo(true)}
                  className="text-black underline flex items-center gap-3 font-semibold my-4 uppercase"
                >
                  Contact landlord <MdOutlinePermContactCalendar size={20} />
                </button>
              )}
              {userInfo && !cancelInfo && (
                <div className="fixed inset-0  sm:px-0 px-2 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                  <ListingsLandLordInfo
                    listing={listing}
                    setCancelInfo={setCancelInfo}
                    handleShowMessage={handleShowMessage}
                  />{" "}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
