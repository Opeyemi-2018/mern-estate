import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  // useEffect hook to perform side effects in the functional component
useEffect(() => {
  // Define an asynchronous function to fetch the landlord's information
  const fetchLandlord = async () => {
    try {
      // Send a GET request to the API endpoint to retrieve the landlord's data using the userRef from the listing
      const res = await fetch(`/api/user/${listing.userRef}`);
      
      // Parse the response data as JSON
      const data = await res.json();
      
      // Update the landlord state with the fetched data
      setLandlord(data);
    } catch (error) {
      // Log any errors that occur during the fetch operation
      console.log(error);
    }
  };

  // Call the fetchLandlord function to initiate the API request
  fetchLandlord();
  
  // The dependency array for the useEffect hook, causing it to run
  // whenever the listing.userRef value changes
}, [listing.userRef]);

  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-2'>
          <p>
            Contact <span className='font-semibold'>{landlord.username}</span>{' '}
            for{' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <textarea name='message' id='message' rows='2' value={message} onChange={onChange}
            placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg'
          ></textarea>

          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
            >
                Send Message          
          </Link>
        </div>
      )}
    </>
  );
}