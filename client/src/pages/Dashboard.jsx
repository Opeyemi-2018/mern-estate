import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { BsFillHousesFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { ImUsers } from "react-icons/im";
import { FaSignOutAlt } from "react-icons/fa";
import Profile from "./Profile";
import DashboardOverview from "./DashboardOverview";
import { IoIosCreate } from "react-icons/io";

import { useState, useEffect } from "react";
import {
  deleteUserFailure,
  signOutUserStart,
  deleteUserSuccess,
} from "../redux/user/userSlice";
import UserListing from "./UserListing";
import { IoMdCreate } from "react-icons/io";
import Users from "./Users";

const Dashboard = ({ showNav }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

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
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <main className="min-h-screen flex">
      {/* Fixed Sidebar */}
      <div
        className={`bg-[#001030] w-[250px] px-3  py-2 hidden lg:inline-block fixed top-[72px] bottom-40 overflow-x-auto overflow-y-auto`}
      >
        <div className="flex flex-col gap-6 mt-10">
          {/* Example for another tab */}
          {/* <Link to="/dashboard?tab=dashboardoverview" className={`font-semibold flex items-center gap-2  text-white px-2 py-1 rounded-sm ${tab === 'dashboardoverview' ? 'bg-gray-600' : 'hover:text-[#1E2128] hover:bg-gray-200'}`}>
            <MdDashboard size={20} />
            <span className="">Dashboard</span>
          </Link> */}

          <Link
            to={"/dashboard?tab=profile"}
            className={`font-semibold  text-white px-2 py-1  rounded-sm flex items-center justify-between ${
              tab === "profile" ? "bg-[#002670]" : "hover:bg-[#002670]"
            }`}
          >
            <p className="flex items-center gap-2">
              <FaUser size={20} /> Profile
            </p>
            <span className="text-sm font-normal bg-white px-[6px] text-[#1E2128] hover:bg-[#1E2128] border border-gray-950 hover:text-white rounded-md">
              {currentUser.isAdmin
                ? "Admin"
                : currentUser.isAgent
                ? "Agent"
                : "Client"}
            </span>
          </Link>

          {currentUser && currentUser.isAdmin && (
            <Link
              to={"/dashboard?tab=users"}
              className={`text-white p-1 rounded-sm flex items-center gap-2 font-semibold ${
                tab === "users" ? "bg-[#002670]" : "hover:bg-[#002670]"
              }`}
            >
              <FaUsers /> Users
            </Link>
          )}

          {currentUser && (currentUser.isAdmin || currentUser.isAgent) && (
            <Link
              to={"/create-listing"}
              className={`text-[#002670] hover:text-white bg-[#fff] p-2 rounded-md flex items-center gap-2 font-semibold ${
                tab === "create-listing" ? "bg-[#002670]" : "hover:bg-[#002670]"
              }`}
            >
              <IoMdCreate /> Create listing
            </Link>
          )}

          <Link
            to={"/dashboard?tab=user-listing"}
            className={`text-white p-1 rounded-sm font-semibold flex items-center gap-2 ${
              tab === "user-listing" ? "bg-[#002670]" : "hover:bg-[#002670]"
            }`}
          >
            <BsFillHousesFill size={20} />{" "}
            {currentUser.isAdmin ? (
              <span>Available listings</span>
            ) : (
              <span>My listing</span>
            )}
          </Link>

          <div>
            <button
              onClick={handleSignOut}
              className="pointer text-white  hover:bg-[#002670] p-1 rounded-sm flex items-center gap-2 font-semibold"
            >
              <FaSignOutAlt size={20} /> Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`bg-[#001030] text-white w-[60px] px-3  lg:hidden inline fixed ${
          showNav ? "top-[185px]" : "top-[75px]"
        } bottom-56 overflow-x-auto overflow-y-auto`}
      >
        <div className="flex flex-col gap-6 mt-10">
          <Link to={"/dashboard?tab=profile"} className="">
            <FaUser className="text-white" size={20} />
          </Link>

          {currentUser && currentUser.isAdmin && (
            <Link to={"/dashboard?tab=users"}>
              <FaUsers className="text-white" />
            </Link>
          )}

          {currentUser && (currentUser.isAdmin || currentUser.isAgent) && (
            <Link to={"/create-listing"}>
              <IoIosCreate className="text-white" />
            </Link>
          )}

          <Link to={"/dashboard?tab=user-listing"} className="">
            <BsFillHousesFill className="text-white" size={20} />
          </Link>

          <div>
            <button onClick={handleSignOut} className="">
              <FaSignOutAlt size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Content Area with padding to account for the fixed sidebar */}
      <div className="flex-1 p-4 lg:ml-[250px] ml-[60px] overflow-auto whitespace-nowrap w-full">
        {/* Render content based on active tab */}
        {tab === "profile" && <Profile />}
        {tab === "user-listing" && <UserListing />}
        {tab === "users" && <Users />}
      </div>
    </main>
  );
};

export default Dashboard;
