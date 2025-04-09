import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
const ProfileUserListings = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [userListings, setUserListing] = useState([]);

  useEffect(() => {
    const getUserListings = async () => {
      try {
        setIsLoading(true);
        let res = await fetch(`api/user/${currentUser._id}`);
        if (!res.ok) {
          throw new Error("something went wrong");
        }
        const data = await res.json();
        setUserListing(data.listings);
        setIsLoading(false);
      } catch (error) {
        toast.error(error.message, {
          pauseOnHover: false,
          draggable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    getUserListings();
  }, [currentUser._id]);

  return (
    <div>
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
            {!currentUser.isClient && <p>my listing</p>}
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
            const { name, regularPrice, imageUrls } = userListing;
            return (
              <Link
                key={userListing._id}
                className="flex flex-col gap-1 relative group"
              >
                <div className="relative">
                  <Link
                    to={`/update-listing/${userListing._id}`}
                    className="absolute z-10 bg-green-600 p-1 rounded-full text-white left-1 top-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                  >
                    <CiEdit size={25} />
                  </Link>
                  <button className="bg-red-600 z-10 text-white rounded-full p-1 absolute right-2 top-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <RiDeleteBin5Line size={25} />
                  </button>
                </div>
                <Link
                  to={`/listing/${userListing._id}`}
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
                  to={`/listing/${userListing._id}`}
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
