import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const UserListing = () => {
    let {currentUser} = useSelector((state) => state.user)
    
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
    useEffect(() => {
        const handleShowListings = async () => {
            try {
              setShowListingsError(false);
              const res = await fetch(`/api/user/listing/${currentUser._id}`);
              const data = await res.json();
              if (data.success === false) {
                setShowListingsError(true);
                return;
              }
              console.log(data);
              
              setUserListings(data);
            } catch (error) {
              setShowListingsError(true);
            }
          };
          handleShowListings()
    }, [currentUser._id])
    
      const handleListingDelete = async (listingId) => {
        try {
          const res = await fetch(`/api/listing/delete/${listingId}`, {
            method: 'DELETE',
          });
          const data = await res.json();
          if (data.success === false) {
            console.log(data.message);
            return;
          }
    
          setUserListings((prev) =>
            prev.filter((listing) => listing._id !== listingId)
          );
        } catch (error) {
          console.log(error.message);
        }
      };
  return (
    <div className="p-3">
        {userListings && userListings.length > 0 && (
          <div className='max-w-full mx-auto'>
                <h1 className='text-center mt-7 text-2xl font-semibold'>
                    Your Listings
                </h1>
                {userListings.map((listing) => (
                    <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
                        <Link to={`/listing/${listing._id}`}>
                            <img src={listing.imageUrls[0]} alt='listing cover'
                            className='h-16 w-16 object-contain' />
                        </Link>
                        
                        <Link
                            className='text-slate-700 font-semibold  hover:underline truncate'
                            to={`/listing/${listing._id}`} > <p>{listing.name}</p>
                        </Link>
                        
                         <button onClick={() => handleListingDelete(listing._id)}
                            className='text-red-700 uppercase'>  Delete
                         </button>
                           
                         <Link to={`/update-listing/${listing._id}`}>
                         <button className='text-green-700 uppercase'>Edit</button>
                        </Link>
                        
                     </div>
                ))}
           </div>
       )}
    </div>
  )
}

export default UserListing