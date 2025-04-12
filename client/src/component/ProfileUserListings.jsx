import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import { Modal } from "antd";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

const ProfileUserListings = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [userListings, setUserListing] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState(null);

  useEffect(() => {
    const getUserListings = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`api/user/${currentUser._id}`);
        if (!res.ok) throw new Error("Something went wrong");
        const data = await res.json();
        setUserListing(data.listings);
      } catch (error) {
        toast.error(error.message || "Failed to fetch listings");
      } finally {
        setIsLoading(false);
      }
    };

    getUserListings();
  }, [currentUser._id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/listing/delete/${selectedListingId}`);
      setUserListing((prev) =>
        prev.filter((item) => item._id !== selectedListingId)
      );
      toast.success("Listing deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete listing");
    } finally {
      setShowModal(false);
      setSelectedListingId(null);
    }
  };

  const confirmDelete = (listingId) => {
    setSelectedListingId(listingId);
    setShowModal(true);
  };

  return (
    <div>
      <ToastContainer />
      <Modal
        title="Confirm Deletion"
        open={showModal}
        onOk={handleDelete}
        onCancel={() => setShowModal(false)}
        okText="Yes, Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete this listing? This action is
          irreversible.
        </p>
      </Modal>

      <div>
        {userListings.length === 0 && !currentUser.isClient ? (
          <div className="md:text-2xl text-[20px] font-semibold flex items-start flex-col gap-4 justify-center">
            <p>No listing</p>
            <Link
              to={"/dashboard?tab=create-listing"}
              className="text-blue-500 underline"
            >
              Create Listing
            </Link>
          </div>
        ) : (
          <p className="md:text-2xl font-semibold text-[20px]">
            {!currentUser.isClient && <p>My Listings</p>}
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <ClipLoader color="blue" size={50} isLoading={isLoading} />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {userListings.map((userListing) => {
            const { name, regularPrice, imageUrls, _id } = userListing;
            return (
              <Link key={_id} className="flex flex-col gap-1 relative group">
                <div className="relative">
                  <Link
                    to={`/update-listing/${_id}`}
                    className="absolute z-10 bg-green-600 p-1 rounded-full text-white left-1 top-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                  >
                    <CiEdit size={25} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => confirmDelete(_id)}
                    className="bg-red-600 z-10 text-white rounded-full p-1 absolute right-2 top-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                  >
                    <RiDeleteBin5Line size={25} />
                  </button>
                </div>
                <Link
                  to={`/listing/${_id}`}
                  className="text-slate-700 hover:underline truncate"
                >
                  <img
                    src={imageUrls[0]}
                    alt="listing cover"
                    className="h-40 w-full rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                </Link>
                <Link
                  to={`/listing/${_id}`}
                  className="text-slate-700 hover:underline z-10 truncate"
                >
                  <p className="text-1xl font-normal">
                    {name.slice(0, 20)} .....
                  </p>
                  <p>${regularPrice}</p>
                </Link>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProfileUserListings;
