import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../component/Contact';

// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const {listingId} = useParams();
  const { currentUser } = useSelector((state) => state.user);

  // useEffect hook to perform side effects in function components
useEffect(() => {
  // Define an asynchronous function to fetch the listing data
  const fetchListing = async () => {
      try {
          // Set loading state to true before starting the fetch operation
          setLoading(true);

          // Perform a GET request to the API to fetch the listing data
          const res = await fetch(`/api/listing/get/${listingId}`);

          // Wait for the response to be parsed as JSON
          const data = await res.json();

          // Check if the API response indicates a failure
          if (data.success === false) {
              // Set error state to true if the API response indicates failure
              setError(true);

              // Set loading state to false as the fetch operation is complete
              setLoading(false);

              // Exit the function early since an error occurred
              return;
          }

          // Set the listing state with the fetched data
          setListing(data);

          // Set loading state to false as the fetch operation is complete
          setLoading(false);

          // Set error state to false indicating no error occurred
          setError(false);
      } catch (error) {
          // Catch any errors that occur during the fetch or data processing

          // Set error state to true indicating an error occurred
          setError(true);

          // Set loading state to false as the fetch operation is complete
          setLoading(false);
      }
  };

  // Call the fetchListing function to initiate the data fetching process
  fetchListing();

// Dependency array containing params.listingId
// useEffect will re-run the fetchListing function if params.listingId changes
}, [listingId]);


  return (
    <main>
      {loading && <div className='h-8 w-8 rounded-full animate-ping  bg-blue-600 absolute top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 '></div>}
      {error && (
        <p className='text-center my-7  text-2xl'>Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
          <FaShare
            // Apply CSS classes to the icon for styling
            className='text-slate-500'

            // Add an onClick event handler to the icon
            onClick={() => {
              // Copy the current page URL to the clipboard
              navigator.clipboard.writeText(window.location.href);

              // Update the state to indicate that the text has been copied
              setCopied(true);

              // Set a timeout to reset the copied state after 2 seconds
              setTimeout(() => {
                setCopied(false);
              }, 2000);
            }}
          />

          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl font-semibold'>
              {listing.name} - ${' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>
            <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {listing.description}
            </p>
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
           {/* Check if the user is logged in, is not the owner of the listing, and has not already clicked the contact button */}
          {currentUser && listing.userRef !== currentUser._id && !contact && (
            <button
              onClick={() => setContact(true)}  
              className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3' 
            >
              Contact landlord
            </button>
          )}
          {/* If the contact state is true, render the Contact component and pass the listing details */}
          {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}