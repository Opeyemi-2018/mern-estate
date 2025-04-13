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
import { Modal, Button } from "antd";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  let [users, setUsers] = useState(null);
  let [userListingCount, setUserListingCount] = useState(0);
  const dispatch = useDispatch();
  let [showUpdate, setShowUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showListings, setShowListings] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [signOutModalVisible, setSignOutModalVisible] = useState(false);

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
      setDeleteModalVisible(false);
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
      setSignOutModalVisible(false);
    } catch (error) {
      toast.error(error.message, {
        pauseOnHover: false,
        draggable: true,
      });
      dispatch(deleteUserFailure(error.message));
    }
  };

  const showDeleteModal = () => {
    setDeleteModalVisible(true);
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
  };

  const showSignOutModal = () => {
    setSignOutModalVisible(true);
  };

  const handleCancelSignOut = () => {
    setSignOutModalVisible(false);
  };

  return (
    <>
      <div className="py-3 px-3 lg:ml-0 ml-10">
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
                      onClick={showSignOutModal}
                      className=" text-red-600 font-semibold"
                    >
                      Sign out
                    </button>
                  </div>
                  <button
                    onClick={showDeleteModal}
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
                          show listing <IoIosArrowUp />{" "}
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

      {/* Ant Design Modal for Delete Confirmation */}
      <Modal
        title="Confirm Delete Account"
        open={deleteModalVisible}
        onCancel={handleCancelDelete}
        footer={[
          <Button key="cancel" onClick={handleCancelDelete}>
            Cancel
          </Button>,
          <Button key="delete" type="primary" danger onClick={handleDeleteUser}>
            Delete
          </Button>,
        ]}
      >
        <div className="flex items-center">
          <RiErrorWarningLine className="text-red-500 mr-2 text-xl" />
          <p>Are you sure you want to delete your account?</p>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          This action cannot be undone.
        </p>
      </Modal>

      {/* Ant Design Modal for Sign Out */}
      <Modal
        title="Confirm Sign Out"
        open={signOutModalVisible}
        onCancel={handleCancelSignOut}
        footer={[
          <Button key="cancel" onClick={handleCancelSignOut}>
            Cancel
          </Button>,
          <Button key="signout" type="primary" danger onClick={handleSignOut}>
            Sign Out
          </Button>,
        ]}
      >
        <p>Are you sure you want to sign out?</p>
      </Modal>
    </>
  );
}
