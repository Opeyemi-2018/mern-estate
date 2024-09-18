import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FaHouseChimney } from "react-icons/fa6";
import { FaBars } from "react-icons/fa";
import { LiaTimesSolid } from "react-icons/lia";
import { useDispatch } from "react-redux";
import { IoIosCreate } from "react-icons/io";

import {
  signOutUserStart,
  deleteUserFailure,
  deleteUserSuccess,
} from "../redux/user/userSlice";

export default function Header({ setShowNav, showNav }) {
  const [showPopUp, setShowPopUp] = useState(false);
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
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
      dispatch(deleteUserFailure(data.message));
    }
  };

  return (
    <header className="bg-white shadow-lg w-full">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap gap-1 items-center">
            <span className="text-[#1E2128]">Finder</span>
            <FaHouseChimney className="text-[#1E2128] sm:inline hidden" />
          </h1>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="bg-[rgb(241,245,241)] px-3 py-2  rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-[rgb(241,245,241)] focus:outline-none border-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>

        <ul className="flex items-center gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>

          {currentUser && (currentUser.isAdmin || currentUser.isAgent) && (
            <Link
              to={"/create-listing"}
              className="bg-[#001030] hidden sm:inline text-white rounded-md sm:px-3 px-2 py-2 sm:text-[13px] text-[11px] text-nowrap uppercase"
            >
              create listing
            </Link>
          )}

          {currentUser ? (
            <div className="relative">
              <img
                onClick={() => setShowPopUp(!showPopUp)}
                className="rounded-full h-7  object-cover border-[#001030]  border"
                src={currentUser.avatar}
                alt="profile"
              />
              {showPopUp && (
                <div className="absolute top-14 w-48 z-10 right-0 bg-white shadow-lg p-4 rounded-md">
                  <div className="flex flex-col mb-2 text-gray-800 items-center border border-x-0 border-t-0">
                    <h1 className="truncate w-20">{currentUser.username}</h1>
                  </div>
                  <div className="flex gap-2 flex-col items-start">
                    <Link
                      to={"/dashboard?tab=profile"}
                      onClick={() => setShowPopUp(!showPopUp)}
                      className="my-2 border border-x-0 border-t-0"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setShowPopUp(!showPopUp);
                        handleSignOut();
                      }}
                      className="text-red-700 border border-x-0 border-t-0"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to={"/sign-in"}
              className="text-white bg-[#1E2128] px-3 py-1 rounded-md"
            >
              Sign in
            </Link>
          )}

          <button
            className="sm:hidden inline"
            onClick={() => setShowNav(!showNav)}
          >
            {showNav ? <LiaTimesSolid size={20} /> : <FaBars size={20} />}
          </button>
        </ul>
      </div>

      {/* nav for mobile screen */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 ${
          showNav ? "block max-h-screen" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col gap-2 p-3">
          <Link to="/">
            <li className="text-slate-700 hover:underline">Home</li>
          </Link>
          <Link to="/about">
            <li className="text-slate-700 hover:underline">About</li>
          </Link>
          <Link to="#">
            <li className="text-slate-700 hover:underline">Dashboard</li>
          </Link>
        </ul>
      </div>
    </header>
  );
}
