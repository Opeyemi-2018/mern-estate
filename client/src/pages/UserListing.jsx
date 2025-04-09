import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Modal, Button } from "antd"; // Importing Ant Design Modal and Button
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserListing = () => {
  let { currentUser } = useSelector((state) => state.user);
  const [userListings, setUserListings] = useState([]);
  const [filterType, setFilterType] = useState("all"); // "sale" or "rent"
  let [deleteId, setDeleteId] = useState(null);
  let [deleteName, setDeleteName] = useState("");
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
      }
    };
    handleShowListings();
  }, [currentUser._id]);

  const filteredListings = userListings.filter((listing) =>
    filterType === "all" ? true : listing.type === filterType
  );

  useEffect(() => {
    if (
      (filterType === "sale" || filterType === "rent") &&
      filteredListings.length === 0
    ) {
      toast.error(`No ${filterType} listings available`);
    }
  }, [filteredListings, filterType]);

  if (error) {
    return (
      <div>
        <p>{error}</p>
      </div>
    );
  }

  const showDeleteModal = (id, name) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  const handleDelete = () => {
    setUserListings((prev) =>
      prev.filter((listing) => listing._id !== deleteId)
    );
    toast.success("Property deleted");
  };

  return (
    <div className="flex flex-col">
      <ToastContainer position="top-center" autoClose={3000} />

      {filterType === "all" && filteredListings.length === 0 ? (
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
      ) : (
        <div>
          <div className="shadow-sm px-4 py-3 flex flex-col gap-2 sticky z-20 ">
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

            {/* Additional filter options */}
            <div className="md:flex hidden md:flex-row flex-col md:gap-3 gap-2 justify-between ">
              <select className="p-3 w-full border border-gray-300 outline-none rounded-md">
                <option value="" disabled>
                  Select Location
                </option>
              </select>

              <select className="p-3 w-full border border-gray-300 outline-none rounded-md">
                <option value="" disabled>
                  Select Apartment Type
                </option>
              </select>

              <button className="p-3 rounded-full text-white bg-black">
                Search
              </button>
            </div>
          </div>

          <div className="py-3 sm:px-3 px-1 relative">
            <div className="max-w-full mx-auto">
              <h1 className="my-2 text-2xl font-semibold">
                {currentUser.isAdmin ? "All Listings" : "My Listings"}
              </h1>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {filteredListings.map((listing) => (
                  <div
                    key={listing._id}
                    className="flex flex-col gap-1 relative group"
                  >
                    <div className="relative">
                      <div className="absolute z-10 bg-green-600 p-1 rounded-full text-white left-1 top-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <Link to={`/update-listing/${listing._id}`}>
                          <CiEdit size={25} />
                        </Link>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          showDeleteModal(listing._id, listing.name)
                        }
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
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ant Design Delete Modal */}
      <Modal
        title="Delete property?"
        visible={deleteId !== null}
        onCancel={() => setDeleteId(null)} // Close the modal
        footer={[
          <Button key="cancel" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>,
          <Button key="delete" type="primary" danger onClick={handleDelete}>
            Delete
          </Button>,
        ]}
      >
        <p>
          Are you sure you want to delete{" "}
          <span className="underline text-black font-semibold">
            {deleteName}
          </span>
          ?
        </p>
      </Modal>
    </div>
  );
};

export default UserListing;
