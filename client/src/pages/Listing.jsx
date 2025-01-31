import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import ListingsLandLordInfo from "../component/ListingsLandlordInfo";

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
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userInfo, setUserInfo] = useState(false);
  const [cancelInfo, setCancelInfo] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const { listingId } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    console.log("Fetching listing...", listingId);

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
        // Fetch coordinates after listing data is loaded
        const coords = await fetchCoordinates(data.address);
        setCoordinates(coords);
        setLoading(false);
        setError(false);
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
        <div className="spinner min-h-screen flex items-center justify-center">
          <ClipLoader color="blue" size={50} loading={loading} />
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
        <div className="flex-grow">
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
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
          <div className="max-w-6xl mx-auto p-3 my-7">
            <div className="flex xl:flex-row flex-col gap-4">
              <div className="flex flex-col gap-4 md:mb-0 mb-4">
                <p className="text-2xl font-semibold">
                  {listing.name} - ${" "}
                  {listing.offer
                    ? listing.discountPrice.toLocaleString("en-US")
                    : listing.regularPrice.toLocaleString("en-US")}
                  {listing.type === "rent" && " / month"}
                </p>
                <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
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
                <div className="xl:flex flex-col hidden mt-4">
                  {currentUser &&
                    listing.userRef !== currentUser._id &&
                    !userInfo && (
                      <button
                        onClick={() => setUserInfo(true)}
                        className="hover:bg-red-700 bg-red-600 text-white rounded-lg uppercase hover:opacity-95 p-3"
                      >
                        Contact landlord
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

              {/* Map Container */}
              {coordinates && coordinates.lat && coordinates.lon && (
                <div style={{ height: "400px", width: "100%" }}>
                  <MapContainer
                    center={[coordinates.lat, coordinates.lon]}
                    zoom={13}
                    style={{ width: "100%", height: "100%" }}
                    whenCreated={(map) => map.invalidateSize()}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[coordinates.lat, coordinates.lon]}>
                      <Popup>{listing.address}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              )}
            </div>
            {/* button for mobile screen */}
            <div className="xl:hidden flex flex-col mt-4">
              {currentUser && listing.userRef !== currentUser._id && !userInfo && (
                <button
                  onClick={() => setUserInfo(true)}
                  className="bg-[#001030] text-white rounded-lg uppercase hover:opacity-95 p-3"
                >
                  Contact landlord
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
