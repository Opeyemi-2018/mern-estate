import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { BsHouse } from "react-icons/bs";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from "../redux/userSlice";
import { useDispatch } from "react-redux";
import UserUpdate from "../component/UserUpdate";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import { IoIosArrowDown } from "react-icons/io";
import { RiErrorWarningLine } from "react-icons/ri";
import ProfileUserListings from "../component/ProfileUserListings";
import { IoIosArrowUp } from "react-icons/io";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  let [users, setUsers] = useState(null);
  let [userListingCount, setUserListingCount] = useState(0);
  const dispatch = useDispatch();
  let [showUpdate, setShowUpdate] = useState(false);
  let [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showListings, setShowListings] = useState(false);

  useEffect(() => {
    let fetchUser = async () => {
      try {
        setIsLoading(true);
        let res = await fetch(`api/user/${currentUser._id}`);
        let data = await res.json();
        if (res.ok) {
          setIsLoading(false);
          setUsers(data.user);
          setUserListingCount(data.listingCount);
        } else {
          throw new Error(data.error || "error fetching user data");
        }
      } catch (error) {
        setIsLoading(false);
        toast.error(error.message, {
          pauseOnHover: false,
          draggable: true,
        });
      }
    };
    fetchUser();
  }, [currentUser._id]);

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      const data = await res.json();
      dispatch(deleteUserSuccess(data));
      setOpenModal(false);
    } catch (error) {
      toast.error(error.message, {
        pauseOnHover: false,
        draggable: true,
      });
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      toast.error(error.message, {
        pauseOnHover: false,
        draggable: true,
      });
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <>
      <div className="py-3 px-3 ">
        <h1 className=" flex justify-center sm:text-2xl text-[19px] ">
          {isLoading ? "please wait while we load your data" : "Profile"}
        </h1>

        {isLoading ? (
          <div className="spinner min-h-screen flex items-center justify-center">
            <ClipLoader color="blue" size={50} isLoading={isLoading} />
          </div>
        ) : users ? (
          <div className="">
            {!showUpdate ? (
              <div className=" flex md:flex-row flex-col gap-4 ">
                <div className="flex  md:border-r-2 pt-4 gap-3 pr-2 flex-col">
                  <div className="flex md:justify-start justify-center">
                    <img
                      src={users.image}
                      alt="profile image"
                      className="md:rounded-md object-cover md:border-gray-300 border-black border-2 sm:border-4  md:w-48 w-52 rounded-full h-48"
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    <span className="flex  sm:flex-row flex-col gap-4">
                      <p className="text-gray-500 text-[17px]">
                        name: {users.username}
                      </p>
                    </span>
                    <span className="flex items-center gap-4">
                      <p className="text-gray-500 text-[17px] ">
                        email: {users.email}
                      </p>
                    </span>
                    <p className="flex items-center gap-2">
                      <h1 className="text-gray-500 text-[17px]">
                        no of listing:{" "}
                        <span className="font-bold text-black">
                          {userListingCount}
                        </span>
                      </h1>
                      <BsHouse size={25} />
                    </p>
                  </div>

                  <div className="flex  gap-4">
                    <button
                      onClick={() => setShowUpdate(!showUpdate)}
                      className=" text-green-600 font-semibold"
                    >
                      Update
                    </button>
                    <button
                      onClick={handleSignOut}
                      className=" text-red-600 font-semibold"
                    >
                      Sign out
                    </button>
                  </div>
                  <button
                    onClick={() => setOpenModal(!openModal)}
                    className="border md:w-48 w-full text-center text-white bg-red-600 rounded-md px-[4px] md:py-[1px] py-2"
                  >
                    Delete
                  </button>
                  {!currentUser.isClient && (
                    <button
                      onClick={() => setShowListings(!showListings)}
                      className="font-semibold  inline md:hidden text-2xl"
                    >
                      {showListings ? (
                        <p className="flex justify-between">
                          hide listings <IoIosArrowDown />
                        </p>
                      ) : (
                        <p className="flex justify-between">
                          hide listing <IoIosArrowUp />{" "}
                        </p>
                      )}
                    </button>
                  )}
                </div>

                <div
                  className={`md:inline ${showListings ? "inline" : "hidden"} `}
                >
                  <ProfileUserListings />
                </div>
              </div>
            ) : (
              <UserUpdate
                showUpdate={showUpdate}
                setShowUpdate={setShowUpdate}
              />
            )}
          </div>
        ) : (
          <div className="text-center text-lg text-gray-500">
            Error loading user data
          </div>
        )}
      </div>

      {/* Modal for deletion */}
      {openModal && (
        <div className="fixed inset-0 sm:px-0 px-2 bg-gray-800 bg-opacity-30 flex justify-center items-center z-30">
          <div className="w-96 h-60 bg-red-600 p-4 shadow-lg rounded-md">
            <RiErrorWarningLine className="sm:h-14 sm:w-14 w-12 h-12 text-white mb-4 mx-auto" />
            <div className="flex flex-col items-center text-white mb-4">
              <h1 className="text-lg">
                Did you really want to delete your account?
              </h1>
              <p>This action cannot be undone</p>
            </div>
            <div className="flex gap-8 justify-center mt-6">
              <button
                onClick={() => setOpenModal(false)}
                className="bg-black capitalize text-white rounded-md sm:py-2 py-[7px] px-4"
              >
                No, cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="bg-white capitalize border-white rounded-md sm:py-2 py-[7px] px-4 text-black"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
