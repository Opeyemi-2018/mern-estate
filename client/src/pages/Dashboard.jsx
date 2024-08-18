import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { BsFillHousesFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { ImUsers } from "react-icons/im";
import { FaSignOutAlt } from "react-icons/fa";
import Profile from './Profile';

import { useState, useEffect } from "react";
import { deleteUserFailure, signOutUserStart, deleteUserSuccess } from '../redux/user/userSlice';
import UserListing from "./UserListing";
import { IoMdCreate } from "react-icons/io";
import Users from "./Users";

const Dashboard = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
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
    <main className='min-h-screen mt-20 flex'>
      {/* Fixed Sidebar */}
      <div className='bg-[#1E2128] w-[250px] px-3 py-2 hidden lg:inline-block fixed top-0 bottom-40  overflow-x-auto overflow-y-auto'>
        <div className="flex flex-col gap-6 mt-20">
          {currentUser && currentUser.isAdmin && (
            <Link to="/" className="font-semibold flex items-center gap-2 text-white  hover:bg-gray-200 p-1 rounded-sm">
              <MdDashboard size={20} />
              <span className="text-white">Dashboard</span>
            </Link>
          )}

          <Link to={'/dashboard?tab=profile'} className="font-semibold  text-white hover:text-[#1E2128] hover:bg-gray-200 px-2 py-1 rounded-sm flex items-center justify-between">
            <p className="flex items-center  gap-2"><FaUser size={20} /> Profile</p>
            <span className="text-sm font-normal bg-white px-[6px] text-[#1E2128] hover:bg-[#1E2128] border border-gray-950 hover:text-white rounded-md">{currentUser.isAdmin ? 'Admin' : 'User'}</span>
          </Link>

          {currentUser && currentUser.isAdmin && (
            <Link to={'/'} className="font-semibold text-white hover:text-[#1E2128] hover:bg-gray-200 p-1 rounded-sm  flex items-center gap-2">
              <ImUsers size={20} /> Agents
            </Link>
          )}

          {currentUser && currentUser.isAdmin && (
            <Link to={'/dashboard?tab=users'} className="text-white hover:text-[#1E2128] hover:bg-gray-200 p-1 rounded-sm flex items-center gap-2 font-semibold">
              <FaUsers /> Users
            </Link>
          )}

          {currentUser && currentUser.isAdmin && (
            <Link to={'/create-listing'} className="text-[#1E2128] bg-[#fff] hover:bg-gray-200 p-2 rounded-md flex items-center gap-2 font-semibold">
              <IoMdCreate /> Create listing
            </Link>
          )}

          <Link to={'/dashboard?tab=user-listing'} className="text-[white] hover:text-[#1E2128] hover:bg-gray-200 p-1 rounded-sm font-semibold flex items-center gap-2">
            <BsFillHousesFill size={20} /> Available listings
          </Link>

          <div>
            <button onClick={handleSignOut} className="pointer text-white hover:text-[#1E2128] hover:bg-gray-200  p-1 rounded-sm flex items-center gap-2 font-semibold">
              <FaSignOutAlt size={20} /> Sign out
            </button>
          </div>
         
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className='bg-white w-[60px] px-3 mt-6 lg:hidden inline fixed top-0 bottom-40  overflow-x-auto overflow-y-auto'>
        <div className="flex flex-col gap-6 mt-4">
          {currentUser && currentUser.isAdmin && (
            <Link to="/" className="">
              <MdDashboard size={20} />
            </Link>
          )}

          <Link to={'/dashboard?tab=profile'} className="">
            <FaUser size={20} />
          </Link>

          {currentUser && currentUser.isAdmin && (
            <Link to={'/'} className=""><ImUsers size={20} /> </Link>
          )}

          {currentUser && currentUser.isAdmin && (<Link className=""><FaUsers /></Link>)}

          <Link to={'/dashboard?tab=user-listing'} className="">
            <BsFillHousesFill size={20} />
          </Link>

          <div>
            <button onClick={handleSignOut} className=""><FaSignOutAlt size={20} /></button>
          </div>
        </div>
      </div>

      {/* Content Area with padding to account for the fixed sidebar */}
      <div className="flex-1 p-4 lg:ml-[250px] ml-[60px] overflow-auto whitespace-nowrap w-full">
        {tab === 'profile' && <Profile />}
        {tab === 'user-listing' && <UserListing />}
        {tab === 'users' && <Users/>}
      </div>
    </main>
  );
};

export default Dashboard;
