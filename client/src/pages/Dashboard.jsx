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
import { FaMessage } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { IoHomeOutline } from "react-icons/io5";

import {
  deleteUserFailure,
  signOutUserStart,
  deleteUserSuccess,
} from "../redux/userSlice";
import UserListing from "./UserListing";
import { IoMdCreate } from "react-icons/io";
import Users from "./Users";
import Messaging from "./Messaging";
import CreateListing from "./CreateListing";

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
    <main className="flex justify-between ">
      {/* Fixed Sidebar */}
      <div
        className={`w-[250px]  font-nunito px-3 bg-[#1e2128] pt-4 pb-5  hidden md:flex flex-col justify-between h-screen sticky top-0`}
      >
        {/* top div */}
        <div className="flex flex-col gap-6 ">
          <div>
            <Link to={"/"} className="text-white flex gap-2 p-2 ">
              {" "}
              <IoHomeOutline size={25} /> Finder
            </Link>
            <hr className="" />
          </div>

          <div className="flex items-center gap-2 bg-[#DBB65D]">
            <img
              src={currentUser.avatar}
              className="w-14 object-cover "
              alt=""
            />
            <div className="p-2">
              <p>{currentUser.username}</p>
              <p>{currentUser.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 ">
            {currentUser && currentUser.isAdmin && (
              <Link
                to={"/dashboard?tab=users"}
                className={`flex items-center gap-2 rounded-md p-2 hover:bg-[#2c2f36] ${
                  tab === "users" ? "bg-[#2c2f36]" : ""
                }`}
              >
                <FaUsers size={20} className="text-white" />
                <p className="text-white">Users</p>
              </Link>
            )}

            {currentUser && (currentUser.isAdmin || currentUser.isAgent) && (
              <Link
                to={"/dashboard?tab=create-listing"}
                className={`flex items-center gap-2 rounded-md p-2 hover:bg-[#2c2f36] ${
                  tab === "create-listing" ? "bg-[#2c2f36]" : ""
                }`}
              >
                <IoMdCreate size={20} className="text-white" />
                <p className="text-white">Create listing</p>
              </Link>
            )}

            {!currentUser.isClient && (
              <Link
                to={"/dashboard?tab=user-listing"}
                className={`flex items-center gap-2 rounded-md p-2 hover:bg-[#2c2f36] ${
                  tab === "user-listing" ? "bg-[#2c2f36]" : ""
                }`}
              >
                <BsFillHousesFill size={20} className="text-white" />
                <p className="text-white">
                  {currentUser.isAdmin ? "Available listings" : "My listing"}
                </p>
              </Link>
            )}

            <Link
              to={"/dashboard?tab=messaging"}
              className={`flex items-center gap-2 rounded-md p-2 hover:bg-[#2c2f36] ${
                tab === "messaging" ? "bg-[#2c2f36]" : ""
              }`}
            >
              <FaMessage size={20} className="text-white" />
              <p className="text-white">Messaging</p>
            </Link>
          </div>
        </div>

        {/* bottom div  */}
        <div className="bg-white rounded-md text-[#1e2128] p-2">
          <Link
            to={"/dashboard?tab=profile"}
            className={`flex items-center gap-2 rounded-md p-2 text-[#2c2f36] hover:text-white hover:bg-[#2c2f36]s
            }`}
          >
            <FaUser size={20} className="" />
            <p className="">Profile</p>
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 rounded-md p-2 w-full hover:bg-[#2c2f36] hover:text-white"
          >
            <FaSignOutAlt size={20} className="" />
            <p className="">Sign out</p>
          </button>
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

          <Link
            to={"/dashboard?tab=messaging"}
            className={`text-white p-1 rounded-sm font-semibold flex items-center gap-2 ${
              tab === "user-listing" ? "bg-[#002670]" : "hover:bg-[#002670]"
            }`}
          >
            <FaMessage size={25} />
            <span className={`${showSideBar ? "inline" : "hidden"}`}>
              Messaging
            </span>
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
      <div className="flex-1">
        {/* Render content based on active tab */}
        {tab === "profile" && <Profile />}
        {tab === "user-listing" && <UserListing />}
        {tab === "users" && <Users />}
        {tab === "messaging" && <Messaging />}
        {tab === "create-listing" && <CreateListing />}
      </div>
    </main>
  );
};

export default Dashboard;
