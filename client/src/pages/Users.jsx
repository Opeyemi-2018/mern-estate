import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaUserCheck } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RiErrorWarningLine } from "react-icons/ri";
import { MdSupportAgent } from "react-icons/md";
import { MdOutlineManageAccounts } from "react-icons/md";
import { MdOutlineDone } from "react-icons/md";

import { LiaTimesSolid } from "react-icons/lia";

const Users = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  let [loading, setLoading] = useState(false);
  // State to manage modal visibility for delete confirmation
  const [showModal, setShowModal] = useState(false);
  // State to store the ID of the user selected for deletion
  const [userToDelete, setUserToDelete] = useState(null);
  // State to store the username of the user selected for deletion, used in the modal
  const [usernameToDelete, setUsernameToDelete] = useState("");
  let [selectedUser, setSelectedUser] = useState(null);
  let [deleteSuccess, setDeleteSuccess] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/user/getusers");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUsers(data.users);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Failed to fetch users:", error);
        setError("Failed to fetch users. Please try again later.");
      }
    };

    if (currentUser?.isAdmin) {
      fetchUsers();
    }
  }, [currentUser]);

  // Function to handle the deletion of a user
  const handleDeleteUser = async () => {
    if (!userToDelete) return; // If no user is selected, exit the function

    try {
      // Send a DELETE request to the server with the selected user's ID
      const res = await fetch(`/api/user/delete/${userToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json(); // Parse the response data

      if (res.ok) {
        // If the response is successful, filter the deleted user out of the users state
        const updatedUsers = users.filter((user) => user._id !== userToDelete);
        setUsers(updatedUsers); // Update the users state with the remaining users
        setDeleteSuccess("user deleted");
        setTimeout(() => setDeleteSuccess(null), 3000);
        setSelectedUser(null);
      } else {
        console.log(data.message); // Log the error message if the response is not ok
      }
    } catch (error) {
      console.log(error.message); // Log any errors that occur during the fetch request
    } finally {
      setShowModal(false); // Close the modal after the request is handled
      setUserToDelete(null); // Reset the userToDelete state
      setUsernameToDelete(""); // Clear the usernameToDelete state
    }
  };

  // Function to open the delete confirmation modal and set the states for the selected user
  const openModal = (selectedUser) => {
    setUserToDelete(selectedUser._id); // Set the userToDelete state with the selected user's ID
    setUsernameToDelete(selectedUser.username); // Set the usernameToDelete state with the selected user's username
    setShowModal(true); // Show the delete confirmation modal
  };

  // Function to close the modal without deleting the user
  const closeModal = () => {
    setShowModal(false); // Close the modal
    setUserToDelete(null); // Reset the userToDelete state
    setUsernameToDelete(""); // Clear the usernameToDelete state
  };

  let showUserDetails = (user) => {
    setSelectedUser(user);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center flex-grow">
        <div className="h-8 w-8 rounded-full animate-ping bg-[#001030]"></div>
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="font-semibold sm:text-3xl text-1xl underline mb-1">
        Current Users
      </h1>
      <div className="flex items-center justify-between p-3 sm:font-semibold font-normal text-[20px] capitalize">
        <h1>name</h1>
        <h1 className="md:inline hidden">email</h1>
        <h1>status</h1>
      </div>
      {error && <p>{error}</p>}
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        users.map((user) => {
          const { username, email, avatar, isAdmin, isAgent } = user;
          return (
            <div key={user._id} className="relative">
              {/* deleted message popup */}
              <div className="fixed top-[13%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {deleteSuccess && (
                  <p className="flex text-nowrap items-center justify-between gap-3 text-white bg-green-500 rounded-md px-2 py-1">
                    <span>
                      <MdOutlineDone className="bg-white rounded-full p-1 text-3xl text-green-600" />
                    </span>{" "}
                    <span>{deleteSuccess}</span>
                  </p>
                )}
              </div>
              <div
                onClick={() => showUserDetails(user)}
                className="flex items-center cursor-pointer bg-white rounded-md hover:bg-gray-300 shadow-lg p-3 justify-between mb-2"
              >
                <p className="flex-1">{username}</p>
                <p className="flex-1 md:inline hidden">{email}</p>
                <p className="">
                  {isAdmin ? (
                    <span className="flex items-center gap-1 sm:font-semibold font-normal text-white p-1 bg-green-600">
                      Admin <FaUserCheck />
                    </span>
                  ) : isAgent ? (
                    <span className="flex items-center gap-1 sm:font-semibold font-normal text-white p-1 bg-black">
                      Agent <MdSupportAgent />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-semibold text-white bg-gray-700 p-1">
                      Client <MdOutlineManageAccounts />
                    </span>
                  )}
                </p>
              </div>

              {/* fixed div  */}
              {selectedUser && (
                <div className="fixed inset-0 sm:px-0 px-2 bg-gray-800 bg-opacity-10 flex justify-center items-center z-20">
                  <div className="w-96 bg-white p-4 shadow-lg rounded-md relative">
                    <LiaTimesSolid
                      size={25}
                      onClick={() => setSelectedUser(null)}
                      className="absolute top-2 right-2 hover:text-red-600 text-black"
                    />
                    <img
                      src={selectedUser.avatar}
                      alt="user image"
                      className="rounded-full w-20 h-20 mx-auto mb-1"
                    />

                    <p className="text-center text-lg font-semibold">
                      {selectedUser.username}
                    </p>

                    <p className="text-center mb-2">{selectedUser.email}</p>

                    <div className="flex  items-center justify-between">
                      <p className="flex items-center gap-1 ">
                        {" "}
                        status:
                        {selectedUser.isAdmin ? (
                          <span className="flex items-center gap-1 bg-green-600 text-white p-1 rounded-sm">
                            <p>Admin</p> <FaUserCheck />
                          </span>
                        ) : selectedUser.isAgent ? (
                          <span className="flex items-center gap-1 bg-black text-white p-1 rounded-sm">
                            {" "}
                            <p>Agent</p> <MdSupportAgent />
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 bg-gray-700 text-white p-1 rounded-sm">
                            {" "}
                            <p>Client</p> <MdOutlineManageAccounts />
                          </span>
                        )}
                      </p>
                      <span className="">
                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <button
                      onClick={() => openModal(selectedUser)}
                      className="bg-red-600 p-1 rounded-sm text-white w-full mt-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
      {/* Rendering the delete confirmation modal */}
      {showModal && (
        <div className="fixed inset-0  sm:px-0 px-2 bg-gray-800 bg-opacity-30 flex justify-center items-center z-30">
          <div className="w-96 h-60 bg-red-600 p-4 shadow-lg rounded-md">
            <RiErrorWarningLine className="sm:h-14 sm:w-14 w-12 h-12 text-white mb-4 mx-auto" />{" "}
            <div className="flex flex-col  mb-4">
              <h3 className="text-lg text-center text-white">
                Are you sure you want to delete
              </h3>{" "}
              <h1 className="text-white underline text-center font-bold">
                {usernameToDelete}?
              </h1>{" "}
            </div>
            <div className="flex justify-center gap-10 text-white">
              <button
                onClick={closeModal}
                className="bg-black text-white rounded-md sm:p-2 p-1"
              >
                No, cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="bg-white text-black sm:p-2 p-1 rounded-md"
              >
                Yes, I'm sure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
