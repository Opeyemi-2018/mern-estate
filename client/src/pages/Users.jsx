import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Modal, Button, message } from "antd";
import { FaUserCheck } from "react-icons/fa6";
import { RiErrorWarningLine } from "react-icons/ri";
import { MdSupportAgent, MdOutlineManageAccounts } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

const Users = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  let [loading, setLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(null);
  // States for delete confirmation modal
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [usernameToDelete, setUsernameToDelete] = useState("");

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

  // Function to open the delete confirmation modal and set states
  const openModal = (user) => {
    setUserToDelete(user._id);
    setUsernameToDelete(user.username);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setUserToDelete(null);
    setUsernameToDelete("");
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(`/api/user/delete/${userToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        const updatedUsers = users.filter((user) => user._id !== userToDelete);
        setUsers(updatedUsers);
        setDeleteSuccess("User deleted successfully");
        message.success("User deleted successfully");
      } else {
        message.error(data.message || "Deletion failed");
      }
    } catch (error) {
      console.error(error.message);
      message.error("An error occurred");
    } finally {
      closeModal();
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        if (record.isAdmin) {
          return (
            <span className="flex items-center gap-1 text-green-600">
              Admin <FaUserCheck />
            </span>
          );
        } else if (record.isAgent) {
          return (
            <span className="flex items-center gap-1 text-black">
              Agent <MdSupportAgent />
            </span>
          );
        } else {
          return (
            <span className="flex items-center gap-1 text-gray-700">
              Client <MdOutlineManageAccounts />
            </span>
          );
        }
      },
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => (
        <span className="">{new Date(createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button danger onClick={() => openModal(record)}>
          <RiDeleteBin6Line />
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4 overflow-x-hidden lg:ml-0 ml-10">
      <h1 className="font-semibold sm:text-3xl text-xl underline mb-4">
        Current Users
      </h1>
      {error && <p>{error}</p>}
      <div className="overflow-x-auto">
        <Table
          className="custom-table"
          columns={columns}
          dataSource={users.map((user) => ({ ...user, key: user._id }))}
          loading={loading}
          pagination={{ pageSize: 5 }}
          scroll={{ x: true }} // 🔥 This enables horizontal scroll on mobile
        />
      </div>
      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Confirmation"
        visible={showModal}
        onCancel={closeModal}
        footer={[
          <Button key="cancel" onClick={closeModal}>
            Cancel
          </Button>,
          <Button
            key="delete" type="primary" danger
            onClick={handleDeleteUser}
          >
            Delete
          </Button>,
        ]}
      >
        <div className="flex flex-col items-center">
          <RiErrorWarningLine size={48} style={{ color: "red" }} />
          <h3 className="mt-4">
            Are you sure you want to delete{" "}
            <span className="underline font-bold">{usernameToDelete}</span>?
          </h3>
        </div>
      </Modal>
    </div>
  );
};

export default Users;
