import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { PiWarningCircle } from "react-icons/pi";
import { MdOutlineDone } from "react-icons/md";

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
    <div className="p-3 relative">
      {userListings && userListings.length > 0 && (
        <div className="max-w-full mx-auto">
          <h1 className=" my-2 text-2xl font-semibold">
            {currentUser.isAdmin
              ? `${userListings.length > 1 ? "All Listings" : "All listing"}`
              : "My listing"}
          </h1>
          {userListings.map((listing) => {
            let { name, _id, imageUrls } = listing;
            return (
              <div
                key={listing._id}
                className="flex items-center flex-wrap gap-4 bg-white rounded-md hover:bg-gray-300 shadow-lg px-3 sm:py-2 p-1 justify-between my-2"
              >
                <Link to={`/listing/${_id}`}>
                  <img
                    src={imageUrls[0]}
                    alt="listing cover"
                    className="h-16 w-16 object-contain"
                  />
                </Link>

                <Link
                  className="text-slate-700 font-semibold  hover:underline truncate"
                  to={`/listing/${_id}`}
                >
                  {" "}
                  <p>{name}</p>
                </Link>

                <button
                  onClick={() => openModal(listing)}
                  className="text-red-700 uppercase"
                >
                  {" "}
                  Delete
                </button>

                <Link to={`/update-listing/${_id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            );
          })}
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
        <div className="fixed md:w-[600px]  w-[370px] mx-4 text-white sm:mx-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg rounded-md bg-red-600 p-4 sm:py-8 sm:px-10">
          <div className="">
            <span className="flex justify-center items-center sm:text-5xl text-4xl ">
              <PiWarningCircle />
            </span>
            <h1 className="text-center sm:text-2xl text-white text-[18px] mb-3">
              Are you sure ?
            </h1>
            <p className="text-center text-wrap  sm:text-[17px]  text-[15px] ">
              did you really want to delete{" "}
              <span className="font-semibold  underline ml-1">
                {deleteName}
              </span>
              ? this process cannot be undone
            </p>

            <div className="flex gap-8 justify-center mt-6">
              <button
                onClick={closeModal}
                className="bg-black capitalize rounded-md sm:py-2 py-[7px] px-4"
              >
                no cancel
              </button>
              <button
                onClick={handleListingDelete}
                className="bg-white capitalize border-white rounded-md sm:py-2 py-[7px] px-4 text-black"
              >
                yes delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserListing;
