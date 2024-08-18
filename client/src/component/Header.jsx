// Import necessary modules and components from 'react-icons', 'react-router-dom', 'react-redux', and 'react'
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { FaHouseChimney } from "react-icons/fa6";
import { FaBars } from "react-icons/fa";
import { LiaTimesSolid } from "react-icons/lia";
import { useDispatch } from 'react-redux';
import { signOutUserStart, deleteUserFailure, deleteUserSuccess } from '../redux/user/userSlice';



// Define and export the Header component
export default function Header({setShowNav, showNav}) {
  let [showPopUp, setShowPopUp] = useState(false)

  let dispatch = useDispatch()


  // Extract the current user from the Redux store using the useSelector hook
  const { currentUser } = useSelector((state) => state.user);

  // Define a state variable for the search term and a function to update it
  const [searchTerm, setSearchTerm] = useState('');

  // Get the navigate function from useNavigate to programmatically navigate to routes
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const urlParams = new URLSearchParams(window.location.search); // Create a URLSearchParams object from the current URL
    urlParams.set('searchTerm', searchTerm); // Set the 'searchTerm' parameter with the current searchTerm state
    const searchQuery = urlParams.toString(); // Convert the URLSearchParams object to a query string
    navigate(`/search?${searchQuery}`); // Navigate to the search route with the updated query string
  };

  // useEffect hook to update the searchTerm state based on the URL's search term
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search); // Create a URLSearchParams object from the current URL
    const searchTermFromUrl = urlParams.get('searchTerm'); // Get the 'searchTerm' parameter from the URL
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl); // If the search term exists in the URL, update the searchTerm state
    }
  }, [location.search]); // Run this effect whenever the location.search changes

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
      dispatch(deleteUserFailure(data.message));
    }
  };

  return (
    <header className='bg-white shadow-lg fixed top-0 left-0 right-0 z-20'>
      {/* Header container */}
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        {/* Link to the home page */}
        <Link to='/'>
          {/* Site title */}
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap gap-1 items-center'>
            <span className='text-[#dfad39]'>Finder</span>
            <FaHouseChimney className='text-[#dfad39]'/>
          </h1>
        </Link>
        
        {/* Search form */}
        <form
          onSubmit={handleSubmit} // Attach the handleSubmit function to the form's submit event
          className='bg-[rgb(241,245,241)] p-3 rounded-lg flex items-center'
        >
          {/* Search input field */}
          <input
            type='text'
            placeholder='Search...'
            className='bg-[rgb(241,245,241)] focus:outline-none border-none w-24 sm:w-64'
            value={searchTerm} // Bind the input field's value to the searchTerm state
            onChange={(e) => setSearchTerm(e.target.value)} // Update the searchTerm state on input change
          />
          {/* Search button with search icon */}
          <button>
            <FaSearch className='text-slate-600' />
          </button>
        </form>

        {/* Navigation links */}
        <ul className='flex items-center gap-4'>
          <Link to='/'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>
              Home
            </li>
          </Link>
          <Link to='/about'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>
              About
            </li>
          </Link>
         
            {currentUser ? (
              // If the user is signed in, show the user's profile picture
              <div className='relative'>
                <img onClick={()=> setShowPopUp(!showPopUp)}
                  className='rounded-full h-7 w-7 object-cover'
                  src={currentUser.avatar}
                  alt='profile'
                />
                {showPopUp && (
                  <div className='absolute top-14  right-0 bg-white shadow-lg p-4 rounded-md'>
                    <div className='flex flex-col mb-2 text-gray-800 items-center border border-x-0 border-t-0'>
                      <h1 className=''>{currentUser.username}</h1>
                      <p>{currentUser.email}</p>
                    </div >
                    <div className='flex gap-2 flex-col items-start'>
                      <Link to={'/dashboard?tab=profile'}  onClick={()=> setShowPopUp(!showPopUp)} className='my-2 border border-x-0 border-t-0' >Profile</Link>
                      <button onClick={() => { setShowPopUp(!showPopUp); handleSignOut();}} className=' text-red-700 border border-x-0 border-t-0'>Sign out</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // If the user is not signed in, show the 'Sign in' link
              <Link to={'/sign-in'} className=' text-white bg-[#1E2128] px-3 py-1 rounded-md'> Sign in</Link>
            )}
          
            <button  className='sm:hidden inline' onClick={()=> setShowNav(!showNav)}>
             {showNav? <LiaTimesSolid size={30}/> : <FaBars size={20}/> }
            </button>
        </ul> 
      </div>

      {/* nav for mobile screen */}
      <div className={showNav ? 'sm:hidden block p-3 bg-white' : 'hidden '}>
          <ul className='flex flex-col justify-start gap-2'>
            <Link to='/'>
              <li className='text-slate-700 hover:underline'>
                Home
              </li>
            </Link>
            <Link to='/about'>
              <li className='text-slate-700 hover:underline'>
                About
              </li>
            </Link>   
            <Link to='#'>
              <li className='text-slate-700 hover:underline'>
                Dashboard
              </li>
            </Link>   
          </ul>
        </div>
    </header>
  );
}
