import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../component/ListingItem";
import { BsFillSendFill } from "react-icons/bs";
import { ClipLoader } from "react-spinners";
import Hero from "../component/Hero";
import Count from "../component/Count";

export default function Home({ showNav }) {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // New state for error handling

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state before fetching
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        if (!res.ok) throw new Error("Failed to fetch offer listings");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (err) {
        setError("Failed to load offers.");
      } finally {
        setLoading(false);
      }
    };

    const fetchRentListings = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        if (!res.ok) throw new Error("Failed to fetch rent listings");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (err) {
        setError("Failed to load rent listings.");
      } finally {
        setLoading(false);
      }
    };

    const fetchSaleListings = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        if (!res.ok) throw new Error("Failed to fetch sale listings");
        const data = await res.json();
        setSaleListings(data);
      } catch (err) {
        setError("Failed to load sale listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* Top Section */}
      <div className="">
        <Hero />
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="spinner min-h-screen flex items-center justify-center">
          <ClipLoader color="blue" size={50} loading={loading} />
        </div>
      ) : error ? (
        <div className="text-center text-red-600 my-10">
          <p>{error}</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10 min-h-screen">
          {/* Offers Section */}
          {offerListings && offerListings.length > 0 ? (
            <div>
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">
                  Recent offers
                </h2>
                <Link
                  className="text-sm text-blue-800 hover:underline"
                  to={"/search?offer=true"}
                >
                  Show more offers
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {offerListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500">
              <p>No offers available at the moment.</p>
            </div>
          )}

          {/* Rent Section */}
          {rentListings && rentListings.length > 0 ? (
            <div>
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">
                  Recent places for rent
                </h2>
                <Link
                  className="text-sm text-blue-800 hover:underline"
                  to={"/search?type=rent"}
                >
                  Show more places for rent
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {rentListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500">
              <p>No rental properties available at the moment.</p>
            </div>
          )}

          <Count />

          {/* Sale Section */}
          {saleListings && saleListings.length > 0 ? (
            <div>
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">
                  Recent places for sale
                </h2>
                <Link
                  className="text-sm text-blue-800 hover:underline"
                  to={"/search?type=sale"}
                >
                  Show more places for sale
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {saleListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500">
              <p>No properties for sale at the moment.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
