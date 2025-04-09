import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { BsHouse } from "react-icons/bs";
import { FaBars } from "react-icons/fa";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";
import Profile from "./Profile";
import Overview from "../component/Overview";
import { LuMessageCircleMore } from "react-icons/lu";
import { MdOutlineRealEstateAgent } from "react-icons/md";
import { LiaTimesSolid } from "react-icons/lia";
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
// import Messaging from "./Messaging";
import CreateListing from "./CreateListing";
import UpdateListing from "./UpdateListing";
import SavedListing from "../component/SavedListing";
import { Modal } from "antd";

const Dashboard = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {}, [currentUser]);
  const [tab, setTab] = useState("");
  let [showSideBar, setShowSideBar] = useState(false);
  const [signOutModalVisible, setSignOutModalVisible] = useState(false);

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
    } finally {
      setSignOutModalVisible(false);
    }
  };

  const showSignOutModal = () => {
    setSignOutModalVisible(true);
  };

  const handleCancelSignOut = () => {
    setSignOutModalVisible(false);
  };

  return (
    <main className="relative bg-gray-100 min-h-screen lg:p-4 p-0">
      {/* Fixed Sidebar */}
      <div
        className={`lg:flex flex-col justify-between z-20 fixed  hidden bg-[#2c2f36] rounded-md  p-4  top-3 bottom-3   left-3 w-60  `}
      >
        {/* <div className=" "> */}
        <div className="flex flex-col gap-6 ">
          <div>
            <Link to={"/"} className="text-white flex gap-2 p-2 ">
              {" "}
              <IoHomeOutline size={25} /> HomyHub
            </Link>
            <div className="bg-red-500 w-full h-[1px]"> </div>
          </div>

          <div className="flex flex-col gap-2 ">
            {currentUser && currentUser.isAdmin && (
              <Link
                to={"/dashboard?tab=overview"}
                className={`flex items-center gap-2 rounded-md p-2 hover:bg-gray-700 ${
                  tab === "overview" ? "bg-[#2c2f36]" : ""
                }`}
              >
                <MdOutlineSpaceDashboard size={20} className="text-white" />
                <p className="text-white">Overview</p>
              </Link>
            )}

            {currentUser && currentUser.isAdmin && (
              <Link
                to={"/dashboard?tab=users"}
                className={`flex items-center gap-2 rounded-md p-2 hover:bg-gray-700 ${
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
                className={`flex items-center gap-2 rounded-md p-2 hover:bg-gray-700 ${
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
                className={`flex items-center gap-2 rounded-md p-2 hover:bg-gray-700 ${
                  tab === "user-listing" ? "bg-[#2c2f36]" : ""
                }`}
              >
                <BsHouse size={20} className="text-white" />
                <p className="text-white">
                  {currentUser.isAdmin ? "Available listings" : "My listing"}
                </p>
              </Link>
            )}

            {/* <Link
              to={"/dashboard?tab=messaging"}
              className={`flex items-center gap-2 rounded-md p-2 hover:bg-gray-700 ${
                tab === "messaging" ? "bg-[#2c2f36]" : ""
              }`}
            >
              <LuMessageCircleMore size={20} className="text-white" />
              <p className="text-white">Messaging</p>
            </Link> */}

            <Link
              to={"/dashboard?tab=saved-listing"}
              className={`flex items-center gap-2 rounded-md p-2 hover:bg-gray-700 ${
                tab === "messaging" ? "bg-[#2c2f36]" : ""
              }`}
            >
              <MdOutlineFavoriteBorder size={20} className="text-white" />
              <p className="text-white">My saved</p>
            </Link>
          </div>
        </div>

        {/* bottom div  */}
        <div className="bg-white rounded-md text-[#1e2128] p-2">
          <Link
            to={"/dashboard?tab=profile"}
            className={`flex items-center gap-2 rounded-md p-1 text-[#2c2f36] hover:text-white hover:bg-[#2c2f36]
            }`}
          >
            <div className="flex items-center gap-1">
              <img
                src={currentUser.image}
                className="w-9 h-9 object-cover rounded-full border-2 hover:border-white border-[#2c2f36] "
                alt=""
              />
              <div className="p-2">
                <p>{currentUser.username}</p>
              </div>
            </div>
          </Link>
          <button
            onClick={showSignOutModal}
            className="flex items-center gap-2 rounded-md p-2 w-full hover:bg-[#2c2f36] hover:text-white"
          >
            <FaSignOutAlt size={20} className="" />
            <p className="">Sign out</p>
          </button>
        </div>
      </div>

      {/* sidebar for mobile screen  */}
      <div
        className={`bg-[#2c2f36] z-40  top-0 bottom-0 inline lg:hidden fixed
         transition-all duration-500`}
        style={{ width: showSideBar ? "250px" : "40px" }}
      >
        {/* icon for sidebar toggle */}
        <div
          className={`flex flex-col gap-6 mt-8 relative ${
            showSideBar ? "items-left pl-3" : "items-center"
          } `}
        >
          <div>
            <span onClick={() => setShowSideBar(!showSideBar)}>
              {showSideBar ? (
                <LiaTimesSolid
                  size={25}
                  className=" text-white absolute right-3 top-0"
                />
              ) : (
                <FaBars size={25} className=" text-white  " />
              )}
            </span>
          </div>

          <Link
            onClick={() => setShowSideBar(false)}
            to={"/"}
            className={`font-semibold  text-white  py-1  rounded-sm flex items-center justify-between
            `}
          >
            <p className="flex items-center gap-2 ">
              <MdOutlineRealEstateAgent size={25} />{" "}
              <h1 className={`${showSideBar ? "inline" : "hidden"}`}>Home</h1>
            </p>
          </Link>

          <Link
            onClick={() => setShowSideBar(false)}
            to={"/dashboard?tab=overview"}
            className={`font-semibold  text-white  py-1  rounded-sm flex items-center justify-between
            `}
          >
            <p className="flex items-center gap-2 ">
              <MdOutlineSpaceDashboard size={25} />{" "}
              <h1 className={`${showSideBar ? "inline" : "hidden"}`}>
                Overview
              </h1>
            </p>
          </Link>

          <Link
            onClick={() => setShowSideBar(false)}
            to={"/dashboard?tab=profile"}
            className={`font-semibold  text-white  py-1  rounded-sm flex items-center justify-between
            `}
          >
            <div className="flex items-center gap-2 ">
              <FaUser size={25} />{" "}
              <h1 className={`${showSideBar ? "inline" : "hidden"}`}>
                Profile
              </h1>
            </div>
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
              className={`text-white p-1 rounded-sm flex items-center gap-2
              `}
            >
              <FaUsers size={25} />{" "}
              <h1 className={`${showSideBar ? "inline" : "hidden"}`}>Users</h1>
            </Link>
          )}

          {currentUser && (currentUser.isAdmin || currentUser.isAgent) && (
            <Link
              onClick={() => setShowSideBar(false)}
              to={"/dashboard?tab=create-listing"}
              className={`text-white   p-2 rounded-md flex items-center gap-2
              `}
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
            className={`text-white p-1 rounded-sm  flex items-center gap-2 `}
          >
            <BsHouse size={25} />{" "}
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

          {/* <Link
            onClick={() => setShowSideBar(false)}
            to={"/dashboard?tab=messaging"}
            className={`text-white p-1 rounded-sm  flex items-center gap-2`}
          >
            <LuMessageCircleMore size={25} />
            <span className={`${showSideBar ? "inline" : "hidden"}`}>
              Messaging
            </span>
          </Link> */}

          <Link
            onClick={() => setShowSideBar(false)}
            to={"/dashboard?tab=saved-listing"}
            className={`text-white p-1 rounded-sm  flex items-center gap-2`}
          >
            <MdOutlineFavoriteBorder size={25} />
            <span className={`${showSideBar ? "inline" : "hidden"}`}>
              My Saved
            </span>
          </Link>

          <div>
            <button
              onClick={showSignOutModal}
              className="pointer text-white   p-1 rounded-sm flex items-center gap-2 "
            >
              <FaSignOutAlt size={25} />{" "}
              <span className={`${showSideBar ? "inline" : "hidden"}`}>
                Sign out
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area with padding to account for the fixed sidebar */}
      <div
        className={`lg:ml-64 ml-10 md:h-[580px] h-[630px] overflow-y-auto no-scrollbar   bg-white rounded-lg  transition-all duration-300
          `}
      >
        {/* Render content based on active tab */}
        {tab === "overview" && <Overview />}
        {tab === "profile" && <Profile />}
        {tab === "user-listing" && <UserListing />}
        {tab === "users" && <Users />}
        {/* {tab === "messaging" && <Messaging />} */}
        {tab === "create-listing" && <CreateListing />}
        {tab === "saved-listing" && <SavedListing />}
        {/* {tab === `listing/:listingId` && <UpdateListing />} */}
      </div>

      {/* Ant Design Modal for Sign Out Confirmation */}
      <Modal
        title="Confirm Sign Out"
        open={signOutModalVisible}
        onOk={handleSignOut}
        onCancel={handleCancelSignOut}
      >
        <p>Are you sure you want to sign out?</p>
      </Modal>
    </main>
  );
};

export default Dashboard;