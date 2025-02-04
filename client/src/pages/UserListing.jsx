import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MdOutlineDone } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { PiBuildingApartment } from "react-icons/pi";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserListing = () => {
  let { currentUser } = useSelector((state) => state.user);
  const [userListings, setUserListings] = useState([]);
  const [filterType, setFilterType] = useState("all"); // "buy" or "rent"
  let [deleteId, setDeleteId] = useState(null);
  let [deleteName, setDeleteName] = useState("");
  let [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleShowListings = async () => {
      try {
        const res = await fetch(`/api/user/listing/${currentUser._id}`);
        const data = await res.json();
        if (!res.ok) {
          setError("Unable to get data");
          return;
        }
        setUserListings(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setDeleteName("");
        setShowModal(false);
      }
    };
    handleShowListings();
  }, [currentUser._id]);

  // Filter listings based on selection
  const filteredListings = userListings.filter((listing) =>
    filterType === "all" ? true : listing.type === filterType
  );

  if (error) {
    return (
      <div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="shadow-sm px-4 py-3 flex flex-col gap-2 sticky z-40 ">
        {/* Buttons for filtering */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setFilterType("sale")}
            className={`px-3 py-1 rounded-md ${
              filterType === "sale" ? "bg-gray-200 text-black" : "bg-none"
            }`}
          >
            Sale
          </button>
          <button
            onClick={() => setFilterType("rent")}
            className={`px-3 py-1 rounded-md ${
              filterType === "rent" ? "bg-gray-200 text-black" : "bg-none"
            }`}
          >
            Rent
          </button>
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1 rounded-md ${
              filterType === "all" ? "bg-gray-200 text-black" : "bg-none"
            }`}
          >
            All
          </button>
        </div>

        <div className="flex md:flex-row flex-col md:gap-3 gap-2 justify-between ">
          <select
            id="location"
            className=" p-3 w-full border border-gray-300 outline-none rounded-md"
          >
            <option value="" disabled>
              Select Apartment Type
            </option>
          </select>

          <select
            id="apartmentType"
            className="p-3 w-full border border-gray-300 outline-none rounded-md"
          >
            <option value="" disabled>
              Select Apartment Type
            </option>
          </select>

          <button className="p-3 rounded-full text-white bg-black">
            search
          </button>
        </div>
      </div>

      <div className="py-3 sm:px-3 px-1 relative">
        {filteredListings.length > 0 ? (
          <div className="max-w-full mx-auto">
            <h1 className="my-2 text-2xl font-semibold">
              {currentUser.isAdmin ? "All Listings" : "My Listings"}
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {filteredListings.map((listing) => (
                <Link
                  key={listing._id}
                  className="flex flex-col gap-1 relative group"
                >
                  <div className="relative">
                    <Link
                      to={`/update-listing/${listing._id}`}
                      className="absolute z-10 bg-green-600 p-1 rounded-full text-white left-1 top-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                    >
                      <CiEdit size={25} />
                    </Link>
                    <button
                      onClick={() => {
                        setDeleteId(listing._id);
                        setDeleteName(listing.name);
                        setShowModal(true);
                      }}
                      className="bg-red-600 z-10 text-white rounded-full p-1 absolute right-2 top-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                    >
                      <RiDeleteBin5Line size={25} />
                    </button>
                  </div>
                  <Link
                    to={`/listing/${listing._id}`}
                    className="text-slate-700 hover:underline truncate"
                  >
                    <img
                      src={listing.imageUrls[0]}
                      alt="listing cover"
                      className="h-40 w-full rounded-lg object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                  </Link>
                  <Link
                    to={`/listing/${listing._id}`}
                    className="text-slate-700 hover:underline z-10 truncate"
                  >
                    <p className="text-1xl font-normal">
                      {listing.name.slice(0, 20)} .....
                    </p>
                    <p>${listing.regularPrice}</p>
                  </Link>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center flex-col gap-2 mt-20">
            <h1 className="md:text-2xl text-1xl uppercase">
              No listings available!
            </h1>
            <Link
              to={"/dashboard?tab=create-listing"}
              className="md:text-2xl text-1xl underline text-blue-400"
            >
              Create Listing
            </Link>
          </div>
        )}

        {/* Delete Modal */}
        {showModal && (
          <div className="fixed inset-0 sm:px-0 px-2 bg-gray-800 bg-opacity-30 flex justify-center items-center z-30">
            <div className="w-96 bg-white p-5 shadow-lg rounded-md">
              <div className="flex flex-col gap-3">
                <h1 className="text-lg font-semibold">Delete property?</h1>
                <div className="text-gray-700">
                  This will delete{" "}
                  <span className="underline text-black font-semibold">
                    {deleteName}
                  </span>
                </div>
              </div>
              <div className="flex gap-5 justify-end mt-4 items-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="border border-gray-600 hover:bg-gray-200 rounded-full text-black py-2 px-3"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch(
                        `/api/listing/delete/${deleteId}`,
                        { method: "DELETE" }
                      );
                      if (!res.ok) throw new Error("Unable to delete");
                      setUserListings((prev) =>
                        prev.filter((listing) => listing._id !== deleteId)
                      );
                      toast.success("Property deleted");
                    } catch (error) {
                      toast.error(error.message);
                    } finally {
                      setDeleteId(null);
                      setDeleteName("");
                      setShowModal(false);
                    }
                  }}
                  className="bg-red-600 hover:bg-red-500 border-white rounded-full py-2 px-3 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserListing;
