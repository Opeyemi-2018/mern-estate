import { useRef, useState, useEffect } from "react"; // Importing React hooks: useRef, useState, and useEffect
import { useDispatch, useSelector } from "react-redux"; // Importing Redux hooks: useDispatch and useSelector
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'; // Importing Firebase storage functions
import { app } from "../firebase"; // Importing the Firebase app configuration
import { 
  updateUserFailure, updateUserSuccess, updateUserStart, 
  deleteUserFailure, deleteUserStart, deleteUserSuccess, 
  signOutUserStart 
} from "../redux/user/userSlice"; // Importing Redux actions from user slice
import { Link } from "react-router-dom"; // Importing Link component from React Router

// Defining the Profile component
const Profile = () => {
  let fileRef = useRef(null); // Creating a reference to the file input element
  let { currentUser, loading, error } = useSelector((state) => state.user); // Accessing user state from Redux store
  let [file, setFile] = useState(undefined); // State for storing the selected file
  let [filePerc, setFilePerc] = useState(0); // State for tracking file upload percentage
  let [fileUploadError, setFileUploadError] = useState(false); // State for tracking file upload errors
  let [formData, setFormData] = useState({}); // State for storing form data
  let [updateSuccess, setUpdateSuccess] = useState(false); // State for tracking update success
  let [showListingError, setShowListingsError] = useState(false); // State for tracking listing retrieval errors
  let [userListings, setUserListings] = useState([]); // State for storing user listings

  let dispatch = useDispatch(); // Getting the dispatch function from Redux

  // useEffect hook to handle file upload whenever the file state changes
  useEffect(() => {
    if (file) {
      handleFileUpload(file); // Call the handleFileUpload function if a file is selected
    }
  }, [file]); // Dependency array with file state

  // Function to handle file upload to Firebase Storage
  const handleFileUpload = (file) => {
    const storage = getStorage(app); // Get the storage instance from Firebase
    const fileName = new Date().getTime() + file.name; // Create a unique file name using the current timestamp and file name
    const storageRef = ref(storage, fileName); // Create a reference to the storage location
    const uploadTask = uploadBytesResumable(storageRef, file); // Start the file upload task

    // Monitor the state of the file upload
    uploadTask.on(
      'state_changed', // Event listener for upload state changes
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // Calculate the upload progress percentage
        setFilePerc(Math.round(progress)); // Update the file upload percentage state
      },
      (error) => {
        setFileUploadError(true); // Set file upload error state to true if an error occurs
      },
      () => {
        // Get the download URL of the uploaded file and update the form data
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL }) // Update the form data with the uploaded file's download URL
        );
      }
    );
  };

  // Function to handle input changes and update form data state
  let handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value }); // Update form data state with input values
  };

  // Function to handle form submission and update user profile
  let handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      dispatch(updateUserStart()); // Dispatch updateUserStart action to indicate the start of the update process
      let res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST', // HTTP method for the request
        headers: { 'Content-Type': 'application/json' }, // Set the content type to JSON
        body: JSON.stringify(formData) // Send form data as JSON in the request body
      });
      let data = await res.json(); // Parse the response as JSON
      if (data.success === false) {
        dispatch(updateUserFailure(data.message)); // Dispatch updateUserFailure action if the update fails
        return;
      }
      dispatch(updateUserSuccess(data)); // Dispatch updateUserSuccess action if the update succeeds
      setUpdateSuccess(true); // Set update success state to true
    } catch (error) {
      dispatch(updateUserFailure(error.message)); // Dispatch updateUserFailure action if an error occurs
    }
  };

  // Function to handle user deletion
  let handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart()); // Dispatch deleteUserStart action to indicate the start of the delete process
      let res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE" // HTTP method for the request
      });
      let data = await res.json(); // Parse the response as JSON
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message)); // Dispatch deleteUserFailure action if the deletion fails
        return;
      }
      dispatch(deleteUserSuccess(data)); // Dispatch deleteUserSuccess action if the deletion succeeds
    } catch (error) {
      dispatch(deleteUserFailure(error.message)); // Dispatch deleteUserFailure action if an error occurs
    }
  };

  // Function to handle user sign-out
  let handleSignOut = async () => {
    try {
      dispatch(signOutUserStart()); // Dispatch signOutUserStart action to indicate the start of the sign-out process
      let res = await fetch('/api/auth/signout'); // Send a request to sign out the user
      let data = await res.json(); // Parse the response as JSON
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message)); // Dispatch deleteUserFailure action if the sign-out fails
        return;
      }
      dispatch(deleteUserSuccess(data)); // Dispatch deleteUserSuccess action if the sign-out succeeds
    } catch (error) {
      // Handle any errors that occur during sign-out (e.g., logging or user feedback)
    }
  };

  // Function to show user listings
  const handleShowListings = async () => {
    try {
      setShowListingsError(false); // Reset show listings error state
      const res = await fetch(`/api/user/listing/${currentUser._id}`); // Send a request to fetch user listings
      const data = await res.json(); // Parse the response as JSON
      if (data.success === false) {
        setShowListingsError(true); // Set show listings error state to true if fetching listings fails
        return;
      }
      setUserListings(data); // Update user listings state with fetched data
    } catch (error) {
      setShowListingsError(true); // Set show listings error state to true if an error occurs
    }
  };

  // Function to handle listing deletion
  let handleListingDelete = async (listingId) => {
    try {
      let res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE' // HTTP method for the request
      });
      let data = await res.json(); // Parse the response as JSON
      if (data.success === false) {
        console.log(data.message); // Log the error message if listing deletion fails
        return;
      }
      // Update user listings state by removing the deleted listing
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message); // Log any errors that occur during listing deletion
    }
  };

  // JSX to render the Profile component
  return (
    <div className="p-3 max-w-lg mx-auto"> {/* Container div with padding and max-width */}
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1> {/* Heading */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4"> {/* Form with submit handler */}
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*" /> {/* File input */}
        {/* Functionality: This input element allows users to select a file (an image in this case). When a file is selected, 
        the onChange handler updates the file state with the selected file. The ref attribute references this input so it can be programmatically clicked, and hidden hides the input element. */}
        <img
          onClick={() => fileRef.current.click()} // Open file input on image click
          src={formData.avatar || currentUser.avatar} // Display current avatar or default avatar
          // Functionality: This img element displays the user's current avatar or the newly uploaded avatar. 
          // Clicking on the image triggers the file input's click event (using fileRef.current.click()) to open the file selector.
          alt='profile' // Alt text for the image
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' // Image styling
        />
        <p className='text-sm self-center'> {/* Paragraph for upload status */}
          {fileUploadError ? ( // Conditional rendering based on file upload error
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? ( // Conditional rendering based on upload progress
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? ( // Conditional rendering based on upload completion
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>

        <input type="text" placeholder="username" defaultValue={currentUser.username} onChange={handleChange} id="username" className="border p-3 rounded-lg" /> {/* Username input */}
        <input type="email" placeholder="email" defaultValue={currentUser.email} onChange={handleChange} id="email" className="border p-3 rounded-lg" /> {/* Email input */}
        <input type="password" placeholder="password" id="password" className="border p-3 rounded-lg" /> {/* Password input */}
        <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">{loading ? 'loading...' : 'update'}</button> {/* Update button */}

        <Link className="bg-green-700 text-white p-3 rounded-lg uppercase text-center opacity-95" to={'/create-listing'}> {/* Link to create listing page */}
          Create listing
        </Link>
      </form>
      <div className="flex justify-between mt-t"> {/* Container div for delete and sign-out options */}
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete account</span> {/* Delete account option */}
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign out</span> {/* Sign-out option */}
      </div>
      <p className="text-green-700 mt-5">{updateSuccess ? 'User is updated successfully' : ''}</p> {/* Update success message */}
      <button onClick={handleShowListings} className="text-green-700 w-full">Show Listing</button> {/* Show listings button */}
      <p>{showListingError ? 'Error showing Listing' : ''}</p> {/* Show listing error message */}

      {userListings && userListings.length > 0 && ( // Conditional rendering based on user listings
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">Your Listings</h1>
          {userListings.map((listing) => ( // Map through user listings and render each listing
            <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center gap-4">
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className="h-16 w-16 object-contain "
                />
              </Link>
              <Link
                to={`/listing/${listing._id}`}
                className="text-slate-700 font-semibold hover:underline truncate flex-1"
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile; // Exporting the Profile component as default
