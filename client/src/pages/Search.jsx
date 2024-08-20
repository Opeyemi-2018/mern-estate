import { useEffect, useState } from 'react'; // Importing necessary hooks from React
import { useNavigate } from 'react-router-dom'; // Importing useNavigate from react-router-dom for navigation
import ListingItem from '../component/ListingItem'; // Importing ListingItem component

export default function Search() {
  const navigate = useNavigate(); // Initializing useNavigate hook for navigation
  const [sidebardata, setSidebardata] = useState({ // Initializing sidebardata state with default values
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false); // Initializing loading state
  const [listings, setListings] = useState([]); // Initializing listings state
  const [showMore, setShowMore] = useState(false); // Initializing showMore state

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search); // Parsing URL search parameters
    const searchTermFromUrl = urlParams.get('searchTerm'); // Getting searchTerm from URL
    const typeFromUrl = urlParams.get('type'); // Getting type from URL
    const parkingFromUrl = urlParams.get('parking'); // Getting parking from URL
    const furnishedFromUrl = urlParams.get('furnished'); // Getting furnished from URL
    const offerFromUrl = urlParams.get('offer'); // Getting offer from URL
    const sortFromUrl = urlParams.get('sort'); // Getting sort from URL
    const orderFromUrl = urlParams.get('order'); // Getting order from URL

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({ // Setting sidebardata state with values from URL or defaults
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => { // Defining async function to fetch listings
      setLoading(true); // Setting loading state to true
      setShowMore(false); // Setting showMore state to false
      const searchQuery = urlParams.toString(); // Converting URL parameters to string
      const res = await fetch(`/api/listing/get?${searchQuery}`); // Fetching listings from API
      const data = await res.json(); // Parsing response as JSON
      if (data.length > 8) { // Checking if more than 8 listings are returned
        setShowMore(true); // Setting showMore state to true
      } else {
        setShowMore(false); // Setting showMore state to false
      }
      setListings(data); // Setting listings state with fetched data
      setLoading(false); // Setting loading state to false
    };

    fetchListings(); // Calling fetchListings function
  }, [location.search]); // Running useEffect when location.search changes

  const handleChange = (e) => { // Defining handleChange function for form inputs
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id }); // Updating type in sidebardata state
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value }); // Updating searchTerm in sidebardata state
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false, // Updating boolean values in sidebardata state
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at'; // Extracting sort value from input
      const order = e.target.value.split('_')[1] || 'desc'; // Extracting order value from input
      setSidebardata({ ...sidebardata, sort, order }); // Updating sort and order in sidebardata state
    }
  };

  const handleSubmit = (e) => { // Defining handleSubmit function for form submission
    e.preventDefault(); // Preventing default form submission
    const urlParams = new URLSearchParams(); // Initializing URLSearchParams
    urlParams.set('searchTerm', sidebardata.searchTerm); // Setting searchTerm in URL parameters
    urlParams.set('type', sidebardata.type); // Setting type in URL parameters
    urlParams.set('parking', sidebardata.parking); // Setting parking in URL parameters
    urlParams.set('furnished', sidebardata.furnished); // Setting furnished in URL parameters
    urlParams.set('offer', sidebardata.offer); // Setting offer in URL parameters
    urlParams.set('sort', sidebardata.sort); // Setting sort in URL parameters
    urlParams.set('order', sidebardata.order); // Setting order in URL parameters
    const searchQuery = urlParams.toString(); // Converting URL parameters to string
    navigate(`/search?${searchQuery}`); // Navigating to search page with updated URL parameters
  };

  const onShowMoreClick = async () => { // Defining onShowMoreClick function to fetch more listings
    const numberOfListings = listings.length; // Getting current number of listings
    const startIndex = numberOfListings; // Setting startIndex for pagination
    const urlParams = new URLSearchParams(location.search); // Parsing URL search parameters
    urlParams.set('startIndex', startIndex); // Setting startIndex in URL parameters
    const searchQuery = urlParams.toString(); // Converting URL parameters to string
    const res = await fetch(`/api/listing/get?${searchQuery}`); // Fetching more listings from API
    const data = await res.json(); // Parsing response as JSON
    if (data.length < 9) { // Checking if less than 9 listings are returned
      setShowMore(false); // Setting showMore state to false
    }
    setListings([...listings, ...data]); // Appending fetched listings to existing listings state
  };

  return (
    <div className='flex flex-col justify-center md:flex-row'> 
      <div className='p-7  border-b-2 md:border-r-2 md:min-h-screen'> 
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'> 
          <div className='flex items-center gap-2'> 
            <label className='whitespace-nowrap font-semibold'> 
              Search Term:
            </label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
              value={sidebardata.searchTerm}
              onChange={handleChange} // Input for search term with change handler
            />
          </div>
             {/* Container for type checkboxes */}
          <div className='flex gap-2 flex-wrap items-center'> 
            
            {/* Label for type checkboxes */}
            <label className='font-semibold'>Type:</label>  
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='all'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === 'all'} // Checkbox for 'all' type
              />
              <span>Rent & Sale</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === 'rent'} // Checkbox for 'rent' type
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === 'sale'} // Checkbox for 'sale' type
              />
              <span>Sale</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.offer} // Checkbox for 'offer'
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Amenities:</label> 
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.parking} // Checkbox for 'parking'
              />
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.furnished} // Checkbox for 'furnished'
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className='flex items-center gap-2'> 
          {/*  Label for sort dropdown */}
            <label className='font-semibold'>Sort:</label> 
            <select
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              id='sort_order'
              className='border rounded-lg p-3' // Dropdown for sorting options
            >
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to high</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>
          <button className='bg-[#001030] text-white p-3 rounded-lg uppercase hover:opacity-95'> 
            Search
          </button>
        </form>
      </div>


      {/* second div */}
      <div className='flex-1'> 
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Header for listings
           results:
        </h1>
        {/* Container for listing items */}
        <div className='p-7 flex flex-wrap gap-4'>
          {!loading && listings.length === 0 && ( // Message if no listings found
            <p className='text-xl text-slate-700'>No listing found!</p>
          )}
          {loading && ( // Loading indicator
            <div className='h-8 w-8 rounded-full animate-ping  bg-blue-600 absolute top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 '></div>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => ( // Mapping over listings to display ListingItem components
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMore && ( // Show more button if more listings are available
            <button
              onClick={onShowMoreClick}
              className='text-green-700 hover:underline p-7 text-center w-full'
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
