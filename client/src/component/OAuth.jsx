import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'; // Import Firebase authentication methods
import { app } from '../firebase'; // Import the initialized Firebase app
import { useDispatch } from 'react-redux'; // Import useDispatch hook from React Redux
import { signInSuccess } from '../redux/user/userSlice'; // Import the signInSuccess action creator from the user slice
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from React Router

// Define the OAuth component
const OAuth = () => {
    let navigate = useNavigate(); // Initialize navigate function for programmatic navigation
    let dispatch = useDispatch(); // Initialize dispatch function for dispatching Redux actions

    // Define the async function to handle Google sign-in
    let handleGoogleClick = async () => {
        try {
            let provider = new GoogleAuthProvider(); // Create a new instance of the GoogleAuthProvider class
            let auth = getAuth(app); // Get the Firebase Auth instance associated with the app

            // Open a popup window for the user to sign in with their Google account
            // The signInWithPopup function takes two arguments:
            // 1. auth: The Firebase Auth instance associated with the app
            // 2. provider: The GoogleAuthProvider instance configured for Google sign-in
            let result = await signInWithPopup(auth, provider);

            
            // Send the user's information to the backend API
            let res = await fetch('/api/auth/google', {
                method: 'POST', // Specify the HTTP method as POST
                headers: {
                    'Content-Type': 'application/json', // Specify the content type as JSON
                },
                // Convert the user's information to a JSON string and send it in the request body
                body: JSON.stringify({
                    name: result.user.displayName, // Include the user's display name
                    email: result.user.email, // Include the user's email
                    photo: result.user.photoURL // Include the user's profile photo URL
                })
            });

            // Parse the response from the backend as JSON
            let data = await res.json();
            // Dispatch the signInSuccess action with the parsed data to update the Redux store
            dispatch(signInSuccess(data));
            // Navigate to the home page after successful sign-in
            navigate('/');
        } catch (error) {
            // Log any errors that occur during the sign-in process
            console.log('could not sign in with google', error);
        }
    };

    // Return the button element with an onClick handler for Google sign-in
    return (
        <button
            type='button'
            onClick={handleGoogleClick} // Attach the handleGoogleClick function to the button's onClick event
            className='bg-red-700 text-white p-3 w-full rounded-lg uppercase hover:opacity-95' // Add Tailwind CSS classes for styling
        >
            Continue with Google
        </button>
    );
};

export default OAuth; // Export the OAuth component as the default export
