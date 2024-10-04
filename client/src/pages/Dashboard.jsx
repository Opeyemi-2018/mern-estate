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
import { LiaTimesSolid } from "react-icons/lia";
import { IoIosArrowForward } from "react-icons/io";

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
  let [showSideBar, setShowSideBar] = useState(false);

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
    <main className="min-h-screen flex bg-gray-50">
      {/* Fixed Sidebar */}
      <div
        className={`bg-[#001030] w-[250px] px-3  py-2 hidden md:inline-block fixed top-[72px] bottom-40 `}
      >
        <div className="flex flex-col gap-6 mt-10">
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

      {/* sidebar for mobile screen  */}
      <div
        className={`bg-[#001030] z-20 px-1 py-3 inline md:hidden fixed ${
          showNav ? "top-[180px]" : "top-[72px]"
        } bottom-40 transition-all duration-500`}
        style={{ width: showSideBar ? "250px" : "40px" }} // Use inline style for dynamic width
      >
        {/* icon for sidebar toggle */}
        <span onClick={() => setShowSideBar(!showSideBar)}>
          {showSideBar ? (
            <LiaTimesSolid className="absolute text-white text-3xl border p-1 bg-[#001030] border-white rounded-full -right-4" />
          ) : (
            <IoIosArrowForward className="absolute text-white text-3xl border p-1 bg-[#001030] border-white rounded-full -right-4" />
          )}
        </span>
        <div className={`flex flex-col gap-6 mt-10`}>
          <Link
            onClick={() => setShowSideBar(false)}
            to={"/dashboard?tab=profile"}
            className={`font-semibold  text-white  py-1  rounded-sm flex items-center justify-between ${
              tab === "profile" ? "bg-[#002670]" : "hover:bg-[#002670]"
            }`}
          >
            <p className="flex items-center gap-2 ">
              <FaUser size={25} />{" "}
              <h1 className={`${showSideBar ? "inline" : "hidden"}`}>
                Profile
              </h1>
            </p>
            <span
              className={`text-sm font-normal bg-white px-[6px] text-[#1E2128] hover:bg-[#1E2128] border border-gray-950 hover:text-white rounded-md ${
                showSideBar ? "inline" : "hidden"
              }`}
            >
              {currentUser.isAdmin
                ? "Admin"
                : currentUser.isAgent
                ? "Agent"
                : "Client"}
            </span>
          </Link>

          {currentUser && currentUser.isAdmin && (
            <Link
              onClick={() => setShowSideBar(false)}
              to={"/dashboard?tab=users"}
              className={`text-white p-1 rounded-sm flex items-center gap-2 font-semibold ${
                tab === "users" ? "bg-[#002670]" : "hover:bg-[#002670]"
              }`}
            >
              <FaUsers size={25} />{" "}
              <h1 className={`${showSideBar ? "inline" : "hidden"}`}>Users</h1>
            </Link>
          )}

          {currentUser && (currentUser.isAdmin || currentUser.isAgent) && (
            <Link
              onClick={() => setShowSideBar(false)}
              to={"/create-listing"}
              className={`text-[#002670] hover:text-white bg-[#fff] p-2 rounded-md flex items-center gap-2 font-semibold ${
                tab === "create-listing" ? "bg-[#002670]" : "hover:bg-[#002670]"
              }`}
            >
              <IoMdCreate size={25} />{" "}
              <h1 className={`${showSideBar ? "inline" : "hidden"}`}>
                Create listing
              </h1>
            </Link>
          )}

          <Link
            onClick={() => setShowSideBar(false)}
            to={"/dashboard?tab=user-listing"}
            className={`text-white p-1 rounded-sm font-semibold flex items-center gap-2 ${
              tab === "user-listing" ? "bg-[#002670]" : "hover:bg-[#002670]"
            }`}
          >
            <BsFillHousesFill size={25} />{" "}
            {currentUser.isAdmin ? (
              <span className={`${showSideBar ? "inline" : "hidden"}`}>
                Available listings
              </span>
            ) : (
              <span className={`${showSideBar ? "inline" : "hidden"}`}>
                My listing
              </span>
            )}
          </Link>

          <div>
            <button
              onClick={handleSignOut}
              className="pointer text-white  hover:bg-[#002670] p-1 rounded-sm flex items-center gap-2 font-semibold"
            >
              <FaSignOutAlt size={25} />{" "}
              <h1 className={`${showSideBar ? "inline" : "hidden"}`}>
                Sign out
              </h1>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area with padding to account for the fixed sidebar */}
      <div className="flex-1 p-4 md:ml-[250px] ml-[25px] overflow-auto whitespace-nowrap w-full">
        {/* Render content based on active tab */}
        {tab === "profile" && <Profile />}
        {tab === "user-listing" && <UserListing />}
        {tab === "users" && <Users />}
      </div>
    </main>
  );
};

export default Dashboard;
