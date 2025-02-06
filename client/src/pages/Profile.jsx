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

import { RiErrorWarningLine } from "react-icons/ri";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  let [users, setUsers] = useState(null);
  let [userListingCount, setUserListingCount] = useState(0);
  const dispatch = useDispatch();
  let [showUpdate, setShowUpdate] = useState(false);
  let [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let fetchUsers = async () => {
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
    fetchUsers();
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
      <div className="">
        {isLoading ? (
          <div className="spinner min-h-screen flex items-center justify-center">
            <ClipLoader color="blue" size={50} isLoading={isLoading} />
          </div>
        ) : users ? (
          <div className="py-3 px-3 ">
            <h1 className="font-semibold sm:text-2xl text-[19px] ">Profile</h1>
            {!showUpdate ? (
              <div className="flex md:items-center pt-6 gap-6 md:flex-row flex-col">
                <img
                  src={users.image}
                  alt="profile image"
                  className="rounded-md object-cover border-gray-300 sm:border-4  w-48 h-48"
                />

                <div className="flex flex-col gap-4">
                  <span className="flex  sm:flex-row flex-col gap-4">
                    <p className="text-gray-500 text-[18px]  ">
                      name: {users.username}
                    </p>
                  </span>
                  <span className="flex items-center gap-4">
                    <p className="text-gray-500 text-[18px] ">
                      email: {users.email}
                    </p>
                  </span>
                  <p className="flex items-center gap-2">
                    <h1 className="text-gray-500">
                      no of listing:{" "}
                      <span className="font-bold text-black">
                        {userListingCount}
                      </span>
                    </h1>
                    <BsHouse size={25} />
                  </p>
                </div>

                <div className="flex items-center flex-row md:flex-col md:justify-between md:gap-3 gap-4">
                  <span
                    onClick={() => setShowUpdate(!showUpdate)}
                    className=" text-green-600 font-semibold"
                  >
                    Update
                  </span>
                  <span
                    onClick={handleSignOut}
                    className=" text-red-600 font-semibold"
                  >
                    Sign out
                  </span>
                  <span
                    onClick={() => setOpenModal(!openModal)}
                    className="border w-32 text-center text-white bg-red-600 rounded-md px-[4px] md:py-[1px] py-2"
                  >
                    Delete
                  </span>
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
