import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { FaBars } from "react-icons/fa";
import { LiaTimesSolid } from "react-icons/lia";
import { useDispatch } from "react-redux";
import { MdOutlineRealEstateAgent } from "react-icons/md";
import { LuMessageCircleMore } from "react-icons/lu";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  signOutUserStart,
  deleteUserFailure,
  deleteUserSuccess,
} from "../redux/userSlice";

export default function Header({ setShowNav, showNav }) {
  const [showPopUp, setShowPopUp] = useState(false);
  const dispatch = useDispatch();
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopUp(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { currentUser } = useSelector((state) => state.user);

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
      // dispatch(deleteUserFailure(data.message));
      toast.error(error.message, {
        pauseOnHover: false,
        draggable: true,
      });
    }
  };

  return (
    <header className="bg-white shadow-lg z-30 w-full">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        toastClassName="w-[250px] text-center"
      />
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold lg:text-2xl md:text-[18px] flex flex-wrap gap-1 items-center">
            <span className="text-[#1E2128] text-2xl">Finder</span>
            <MdOutlineRealEstateAgent size={25} className="text-[#1E2128] " />
          </h1>
        </Link>

        <ul className="flex  items-center gap-4 font-semibold">
          <Link to="/sell">
            <li className="md:inline hidden  text-slate-700 hover:underline">
              sell
            </li>
          </Link>
          <Link to="/rent">
            <li className=" md:inline hidden text-slate-700 hover:underline">
              rent
            </li>
          </Link>
          <Link to="/about">
            <li className="md:inline hidden  text-slate-700 hover:underline">
              About
            </li>
          </Link>

          {currentUser && (currentUser.isAdmin || currentUser.isAgent) && (
            <Link
              to={"/dashboard?tab=create-listing"}
              className="bg-[#1E2128] hidden md:inline text-white rounded-md sm:px-3 px-2 py-2 sm:text-[13px] text-[11px] text-nowrap uppercase"
            >
              create listing
            </Link>
          )}

          {currentUser && (
            <Link
              to={"/dashboard?tab=messaging"}
              className=" hidden md:flex  text-slate-700  items-center gap-1"
            >
              <p className="">Messaging</p>
              <LuMessageCircleMore size={25} />
            </Link>
          )}

          {currentUser ? (
            <div className="relative">
              <img
                onClick={() => setShowPopUp(!showPopUp)}
                className="rounded-full h-7 w-7  object-cover border-[#001030]  border"
                src={currentUser.image}
                alt="profile"
              />
              {showPopUp && (
                <div
                  ref={popupRef}
                  className="absolute top-14 w-48 z-10 right-0 bg-white shadow-lg p-4 rounded-md"
                >
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
              className="text-white bg-[#1E2128] md:px-3 px-2 py-1 text-nowrap rounded-md"
            >
              Sign in
            </Link>
          )}

          <button
            className="md:hidden inline"
            onClick={() => setShowNav(!showNav)}
          >
            {showNav ? <LiaTimesSolid size={25} /> : <FaBars size={25} />}
          </button>
        </ul>
      </div>

      {/* nav for mobile screen */}
      <div
        className={` text-[20px] md:hidden overflow-hidden transition-all duration-300 ${
          showNav ? "block max-h-screen" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col gap-2 p-3">
          <Link to="/">
            <li className="text-slate-700 hover:underline ">Home</li>
          </Link>
          <Link to="/sell">
            <li className="text-slate-700 hover:underline">Sell</li>
          </Link>
          <Link to="/rent">
            <li className="text-slate-700 hover:underline">Rent</li>
          </Link>
          <Link to="/about">
            <li className="text-slate-700 hover:underline">About</li>
          </Link>

          {currentUser && (
            <Link
              to={"/dashboard?tab=messaging"}
              className="flex  text-slate-700  items-center justify-between"
            >
              <p className="">Messaging</p>
              <LuMessageCircleMore size={25} />
            </Link>
          )}

          {currentUser && (currentUser.isAdmin || currentUser.isAgent) && (
            <Link
              to={"/dashboard?tab=create-listing"}
              className="bg-[#1E2128]  text-white rounded-md sm:px-3 px-2 py-2 text-[18px] text-nowrap uppercase"
            >
              create listing
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
}
