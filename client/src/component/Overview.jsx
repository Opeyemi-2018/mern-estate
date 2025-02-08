import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PiUsersThree } from "react-icons/pi";
import { MdSupportAgent } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

const Overview = () => {
  let { currentUser } = useSelector((state) => state.user.currentUser);
  const [agentsCount, setAgentsCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/user/getusers", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser?.token}`, // Ensure token is sent
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        setTotalUsers(data.totalUsers || 0);
        setAgentsCount(data.agentCount || 0);
        setClientsCount(data.clientCount || 0);
      } catch (error) {
        console.error("Failed to fetch user counts:", error);
        setError("Failed to fetch user counts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserCounts();
  }, [currentUser]);

  return (
    <div className="px-4 ">
      {" "}
      <div className="absolute top-1/2 left-1/2 transform -tranlate-x-1/2 -tranlate-y-1/2">
        <ClipLoader color="blue" size={50} loading={loading} />
      </div>{" "}
      <h1 className="text-2xl">Dashboard Overview</h1>
      <div className="flex items-center sm:gap-8 gap-4 justify-between md:flex-row flex-col">
        <div className="px-5  sm:py-7 py-5 items-center rounded-md shadow-md flex justify-between w-full">
          <div className="text-gray-600">
            <p>Total Users</p>{" "}
            <span className="font-semibold text-2xl">{totalUsers}</span>{" "}
          </div>
          <PiUsersThree
            size={50}
            className="text-red-300 bg-red-50 rounded-full p-3"
          />{" "}
        </div>

        <div className="px-5  sm:py-7 py-5 items-center rounded-md shadow-md flex justify-between w-full">
          <div className="text-gray-600">
            <p>Total Agents</p>{" "}
            <span className="font-semibold text-2xl">{agentsCount}</span>{" "}
          </div>
          <MdSupportAgent
            size={50}
            className="text-red-300 bg-red-50 rounded-full p-3"
          />{" "}
        </div>

        <div className="px-5  sm:py-7 py-5 items-center rounded-md shadow-md flex justify-between w-full">
          <div className="text-gray-600">
            <p>Total Clients</p>{" "}
            <span className="font-semibold text-2xl">{clientsCount}</span>{" "}
          </div>
          <PiUsersThree
            size={50}
            className="text-red-300 bg-red-50 rounded-full p-3"
          />{" "}
        </div>
      </div>
    </div>
  );
};

export default Overview;
