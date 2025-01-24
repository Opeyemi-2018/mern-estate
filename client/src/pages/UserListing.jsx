import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RiErrorWarningLine } from "react-icons/ri";
import { MdOutlineDone } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { PiBuildingApartment } from "react-icons/pi";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";

const UserListing = () => {
  let { currentUser } = useSelector((state) => state.user);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  let [deleteId, setDeleteId] = useState(null);
  let [deleteName, setDeleteName] = useState("");
  let [showModal, setShowModal] = useState(false);
  let [deleteSuccess, setDeleteSuccess] = useState(null);
  console.log(deleteName);

  useEffect(() => {
    const handleShowListings = async () => {
      try {
        setShowListingsError(false);
        const res = await fetch(`/api/user/listing/${currentUser._id}`);
        const data = await res.json();
        if (data.success === false) {
          setShowListingsError(true);
          return;
        }
        console.log(data);

        setUserListings(data);
      } catch (error) {
        setShowListingsError(true);
      } finally {
        setDeleteId(null);
        setDeleteName("");
        setShowModal(false);
      }
    };
    handleShowListings();
  }, [currentUser._id]);

  const handleListingDelete = async () => {
    try {
      const res = await fetch(`/api/listing/delete/${deleteId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== deleteId)
      );
      setDeleteSuccess("listing successfully deleted");
      setTimeout(() => setDeleteSuccess(null), 3000);
    } catch (error) {
      console.log(error.message);
    } finally {
      setDeleteId(null);
      setDeleteName("");
      setShowModal(false);
    }
  };

  let openModal = (listing) => {
    setDeleteId(listing._id);
    setDeleteName(listing.name);
    setShowModal(true);
  };
  let closeModal = () => {
    setDeleteId(null);
    setDeleteName("");
    setShowModal(false);
  };

  if (userListings.length === 0) {
    return (
      <div className="flex items-left flex-col gap-2  mt-20 ">
        <h1 className="md:text-2xl text-1xl uppercase">
          sorry you do not have any listing !!
        </h1>
        <Link to={"/create-listing"} className="md:text-2xl text-1xl underline">
          create listing
        </Link>
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <div className="bg-gray-50 px-4 py-3 flex flex-col gap-2">
        <div className="flex items-center gap-4 ">
          <button className="bg-[#DBB65D]  px-3 py-1 rounded-md">buy</button>
          <button className="bg-white px-3 py-1 rounded-md">rent</button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <div className="relative">
              <IoLocationOutline size={20} className="absolute top-3 left-3" />
              <input
                type="text"
                placeholder="enter location"
                className="w-full p-2 bg-transparent border border-gray-300 rounded-full outline-none text-center"
              />
            </div>
            <div className="relative">
              <PiBuildingApartment
                size={20}
                className="absolute top-3 left-3"
              />
              <input
                type="text"
                placeholder="Apartment type"
                className="w-full p-2 bg-transparent border border-gray-300 rounded-full outline-none text-center"
              />
            </div>
          </div>
          <div>
            <button className="px-3 py-2 bg-black text-white rounded-full">
              search
            </button>
          </div>
        </div>
      </div>
      <div className="py-3 sm:px-3 px-1 relative">
        {userListings && userListings.length > 0 && (
          <div className="max-w-full mx-auto">
            <h1 className=" my-2 text-2xl font-semibold">
              {currentUser.isAdmin
                ? `${userListings.length > 1 ? "All Listings" : "All listing"}`
                : "My listing"}
            </h1>
            <div className="grid grid-cols-4 gap-2 grid-rows-4">
              {userListings.map((listing) => {
                let { name, _id, imageUrls, regularPrice } = listing;
                return (
                  <Link
                    key={listing._id}
                    className="flex flex-col gap-1 relative group"
                  >
                    <div className="relative">
                      <Link
                        to={`/update-listing/${_id}`}
                        className="absolute z-10 bg-green-600 p-1 rounded-full text-white left-1 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <CiEdit size={25} />
                      </Link>
                      <button
                        onClick={() => openModal(listing)}
                        className="bg-red-600 z-10  text-white rounded-full p-1 absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <RiDeleteBin5Line size={25} />
                      </button>
                    </div>
                    <Link
                      className="text-slate-700   hover:underline   truncate"
                      to={`/listing/${_id}`}
                    >
                      <img
                        src={imageUrls[0]}
                        alt="listing cover"
                        className="h-40  w-full rounded-lg object-cover "
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                    </Link>

                    <Link
                      className="text-slate-700   hover:underline z-10  truncate"
                      to={`/listing/${_id}`}
                    >
                      {" "}
                      <p className="text-1xl font-normal">
                        {name.slice(0, 20)} .....
                      </p>
                      <p>${regularPrice}</p>
                    </Link>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* deleted message popup */}
        <div className="fixed top-[10%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {deleteSuccess && (
            <p className="flex text-nowrap items-center justify-between gap-3 text-white bg-green-500 rounded-md px-2 py-1">
              <span>
                <MdOutlineDone className="bg-white rounded-full p-1 text-3xl text-green-600" />
              </span>{" "}
              <span>{deleteSuccess}</span>
            </p>
          )}
        </div>

        {/* modal for deletion */}
        {showModal && (
          <div className="fixed inset-0  sm:px-0 px-2 bg-gray-800 bg-opacity-30 flex justify-center items-center z-30">
            <div className="w-96  bg-white p-5 shadow-lg rounded-md">
              <div className="flex flex-col gap-3 ">
                <h1 className="text-lg font-semibold"> Delete property ?</h1>
                <div className="text-gray-700">
                  This will delete{" "}
                  <span className="underline text-black font-semibold">
                    {deleteName}
                  </span>{" "}
                </div>
              </div>
              <div className="flex gap-5 justify-end mt-4 items-end">
                <button
                  onClick={closeModal}
                  className="border border-gray-600 rounded-full  text-black py-2  px-3"
                >
                  Cancel
                </button>
                <button
                  onClick={handleListingDelete}
                  className="bg-red-600 hover:bg-red-500  border-white rounded-full py-2 px-3 text-white"
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
