import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaUserCheck } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RiErrorWarningLine } from "react-icons/ri";
import { ImUsers } from "react-icons/im";
import { MdSupportAgent } from "react-icons/md";



const Users = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/user/getusers');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUsers(data.users);
            } catch (error) {
                console.error('Failed to fetch users:', error);
                setError('Failed to fetch users. Please try again later.');
            }
        };

        if (currentUser?.isAdmin) {
            fetchUsers();
        }
    }, [currentUser]);

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        
        try {
            const res = await fetch(`/api/user/delete/${userToDelete}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (res.ok) {
                const updatedUsers = users.filter((user) => user._id !== userToDelete);
                setUsers(updatedUsers);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setShowModal(false);
            setUserToDelete(null);
        }
    };

    const openModal = (userId) => {
        setUserToDelete(userId);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setUserToDelete(null);
    };

    return (
        <div>
            {error && <p>{error}</p>}
            {users.length === 0 ? (
                <p>No users found</p>
            ) : (
                users.map((user) => {
                    const { username, email, avatar, isAdmin, isAgent} = user;
                    return (
                        <div key={user._id} className="flex items-center flex-wrap gap-4 bg-white rounded-md hover:bg-gray-300 shadow-lg p-3 justify-between my-2">
                            <div className="flex items-center gap-1 sm:border-r-2 border-none flex-1 flex-wrap">
                                <img src={avatar} alt="user image" className="rounded-full sm:inline hidden h-10 h-10 object-cover object-center" />
                                <div>
                                    <p className="truncate flex-1">{email}</p>
                                    {isAdmin ? (
                                        <span className="flex items-center gap-1 font-semibold text-green-600">
                                            - Admin <FaUserCheck />
                                        </span>
                                    ) : isAgent ? (<span className="flex items-center gap-1 font-semibold text-[#dfad39]">
                                        - Agent <MdSupportAgent />
                                    </span>): (
                                        <span className="font-semibold text-[#1E2128]">- Client</span>
                                    )}
                                </div>
                            </div>
                            <p className="sm:inline hidden flex-1 sm:border-r-2 border-none">{username}</p>
                            <span className="flex-1">{new Date(user.createdAt).toLocaleDateString()}</span>

                            <RiDeleteBin6Line onClick={() => openModal(user._id)} className="text-red-700 cursor-pointer" size={20} />
                        </div>
                    );
                })
            )}

            {/* modal for delete */}
            {showModal && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-md p-4">
                    <div className="text-center">
                        <RiErrorWarningLine className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
                        <h3 className="mb-5 text-lg text-gray-500">
                            Are you sure you want to delete this user?
                        </h3>
                        <div className="flex justify-center gap-10 text-white">
                            <button onClick={handleDeleteUser} className="bg-[#1E2128] p-2 rounded-md">
                                Yes, I'm sure
                            </button>
                            <button onClick={closeModal} className="bg-red-700 rounded-md p-2">
                                No, cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;


// logic for agent