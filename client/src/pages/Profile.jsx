import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { BsHouse } from "react-icons/bs";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import UserUpdate from "../component/UserUpdate";

import { RiErrorWarningLine } from "react-icons/ri";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  let [user, setUser] = useState(null);
  let [userListingCount, setUserListingCount] = useState(0);
  const dispatch = useDispatch();
  let [showUpdate, setShowUpdate] = useState(false);
  let [openModal, setOpenModal] = useState(false);

  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    let fetchUsers = async () => {
      try {
        let res = await fetch(`api/user/${currentUser._id}`);
        let date = await res.json();
        if (res.ok) {
          setUser(date.user);
          setUserListingCount(date.listingCount);
        } else {
          throw new Error(data.error || "error fetching user data");
        }
      } catch (error) {
        console.log(error);
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
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      setOpenModal(false);
    } catch (error) {
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
      dispatch(deleteUserFailure(data.message));
    }
  };

  return (
    <>
      <div className="sm:p-3 p-1 md:max-w-2xl  mx-auto w-full">
        {!showUpdate ? (
          <div className="bg-white sm:rounded-md rounded-sm shadow-lg sm:p-6 p-4 w-full">
            <h1 className="font-semibold sm:text-2xl text-[19px] text-center">
              Profile
            </h1>
            <div className="flex items-center gap-6 md:flex-row flex-col">
              <img
                src={user?.avatar}
                alt="profile image"
                className="rounded-md object-cover border-gray-300 sm:border-4  w-24 h-24 sm:w-32 sm:h-32"
              />
              <div className="">
                <span className="flex items-center sm:flex-row flex-col gap-4 ">
                  <p className="text-gray-500 text-[18px]  lg:inline hidden">
                    name:
                  </p>{" "}
                  <h1 className="md:text-[19px] text-[17px]">
                    {user?.username}
                  </h1>
                </span>
                <span className="flex items-center gap-4">
                  {" "}
                  <p className="text-gray-500 text-[18px] lg:inline hidden">
                    email:
                  </p>{" "}
                  <h1 className="md:text-[17px] text-[19px]">{user?.email}</h1>
                </span>{" "}
                <p className="flex items-center gap-2">
                  <h1 className="text-gray-500">
                    no of listing:{" "}
                    <span className="font-bold text-black">
                      {userListingCount}
                    </span>
                  </h1>
                  {<BsHouse size={25} />}
                </p>
                <div className="flex items-center sm:flex-row flex-col justify-between gap-3 mt-3">
                  <button
                    onClick={() => setShowUpdate(!showUpdate)}
                    className="border w-full text-green-600 border-green-600 bg-white rounded-md px-[4px] md:py-[1px] py-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="border w-full border-red-600 text-red-600 bg-white rounded-md px-[4px] md:py-[1px] py-2"
                  >
                    Sign out
                  </button>
                  <button
                    onClick={() => setOpenModal(!openModal)}
                    className="border w-full text-white bg-red-600 rounded-md px-[4px] md:py-[1px] py-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <UserUpdate showUpdate={showUpdate} setShowUpdate={setShowUpdate} />
        )}
      </div>

      {/* modal for deletion  */}
      {openModal && (
        <div className="fixed inset-0  sm:px-0 px-2 bg-gray-800 bg-opacity-30 flex justify-center items-center z-30">
          <div className="w-96 h-60 bg-red-600 p-4 shadow-lg rounded-md">
            <RiErrorWarningLine className="sm:h-14 sm:w-14 w-12 h-12 text-white mb-4 mx-auto" />{" "}
            {/* <h1 className="text-center sm:text-2xl text-white text-[18px] mb-3">
              Are you sure ?
            </h1> */}
            <div className="flex flex-col items-center text-white mb-4">
              <h1 className="text-lg">
                {" "}
                did you really want to delete your acount
              </h1>
              <p>this action can not be undone</p>
            </div>
            <div className="flex gap-8 justify-center mt-6">
              <button
                onClick={() => setOpenModal(false)}
                className="bg-black capitalize text-white rounded-md sm:py-2 py-[7px] px-4"
              >
                no cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="bg-white capitalize border-white rounded-md sm:py-2 py-[7px] px-4 text-black"
              >
                yes delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
