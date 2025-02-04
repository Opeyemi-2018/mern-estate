import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../component/ListingItem";
import { ClipLoader } from "react-spinners";
import Hero from "../component/Hero";
import Count from "../component/Count";
import Design from "../component/Design";
import { useSelector } from "react-redux";

export default function Home() {
  let { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  SwiperCore.use([Navigation]);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [offerRes, rentRes, saleRes] = await Promise.all([
        fetch("/api/listing/get?offer=true&limit=4"),
        fetch("/api/listing/get?type=rent&limit=4"),
        fetch("/api/listing/get?type=sale&limit=4"),
      ]);

      if (!offerRes.ok || !rentRes.ok || !saleRes.ok) {
        throw new Error("Bad network, Failed to fetch listings");
      }

      const [offerData, rentData, saleData] = await Promise.all([
        offerRes.json(),
        rentRes.json(),
        saleRes.json(),
      ]);

      setOfferListings(offerData);
      setRentListings(rentData);
      setSaleListings(saleData);
    } catch (err) {
      setError("Bad network, Failed to load listings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return (
    <div>
      {/* Top Section */}
      <Hero />

      {/* Main Content */}
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <ClipLoader color="blue" size={50} />
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
          {offerListings.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent offers
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
              <div className="flex flex-wrap gap-4">
                {offerListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}

          {/* Rent Section */}
          {rentListings.length > 0 && (
            <div id="rentSection">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for rent
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/rent"}
              >
                Show more places for rent
              </Link>
              <div className="flex flex-wrap gap-4">
                {rentListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}

          {/* Sale Section */}
          {saleListings.length > 0 && (
            <div id="saleSection">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for sale
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/sell"}
              >
                Show more places for sale
              </Link>
              <div className="flex flex-wrap gap-4">
                {saleListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      <Count />
      <Design />
    </div>
  );
}
