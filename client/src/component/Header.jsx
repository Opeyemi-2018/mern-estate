// Import necessary modules and components from 'react-icons', 'react-router-dom', 'react-redux', and 'react'
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { FaHouseChimney } from "react-icons/fa6";
import { FaBars } from "react-icons/fa";
import { LiaTimesSolid } from "react-icons/lia";


// Define and export the Header component
export default function Header({setShowNav, showNav}) {

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
            className='bg-[rgb(241,245,241)] focus:outline-none w-24 sm:w-64'
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
          <Link to='/profile'>
            {currentUser ? (
              // If the user is signed in, show the user's profile picture
              <img
                className='rounded-full h-7 w-7 object-cover'
                src={currentUser.avatar}
                alt='profile'
              />
            ) : (
              // If the user is not signed in, show the 'Sign in' link
              <li className=' text-white bg-[#1E2128] px-3 py-1 rounded-md'> Sign in</li>
            )}
          </Link>
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
