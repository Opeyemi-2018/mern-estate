import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../component/OAuth";
import signUpImage from '../assets/images/sign-up.png';

const SignUp = () => {
    let [loading, setLoading] = useState(false);
    let [error, setError] = useState(null);
    let [formData, setFormData] = useState({});
    let navigate = useNavigate();

    // Handle text inputs (username, email, password) and checkboxes (agent, client)
    let handleChange = (e) => {
        const { id, type, checked } = e.target;

        if (type === "checkbox") {
            // When a checkbox is clicked, update the formData to ensure only one is true
            if (id === "agent") {
                setFormData({ ...formData, isAgent: checked, isClient: !checked });
            } else if (id === "client") {
                setFormData({ ...formData, isClient: checked, isAgent: !checked });
            }
        } else {
            // Handle other inputs (username, email, password)
            setFormData({ ...formData, [id]: e.target.value });
        }
        console.log(formData);
        
    };

    let handleSubmit = async (e) => {
      e.preventDefault();

      // Check if either "Agent" or "Client" is selected
      if (!formData.isAgent && !formData.isClient) {
        setError("Please select either 'Agent' or 'Client'.");
        return;
      }

      try {
          setLoading(true);
          let res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
          });
          let data = await res.json();
          if (data.success === false) {
            setError(data.message);
            setLoading(false);
            return;
          }
          setLoading(false);
          setError(null);
          navigate('/sign-in');
      } catch (error) {
        setLoading(false);
        setError(error.message);
      }
    };

    return (
      <div className='sm:px-28 px-3 py-10 mt-20 min-h-screen'>
        <div className="flex gap-10 justify-between">
          <img src={signUpImage} alt="Sign Up" className="flex-1 sm:inline hidden rounded-lg w-40 h-[500px] cover/center"/>  
          <div className="flex-1">
            <h1 className='text-3xl text-[#1E2128] font-semibold my-7'>Welcome to Finder</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
              <input type="text" id='username' placeholder='Username' className='w-full border p-3 rounded-lg' onChange={handleChange} />
              <input type="text" id='email' placeholder='Email' className='w-full border p-3 rounded-lg' onChange={handleChange}/>
              <input type="password" id='password' placeholder='Password' className='w-full border p-3 rounded-lg' onChange={handleChange}/>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="agent" className="w-5 h-5" onChange={handleChange} checked={formData.isAgent || false} />
                  <span className="font-semibold text-gray-600">Agent</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="client" className="w-5 h-5" onChange={handleChange} checked={formData.isClient || false} />
                  <span className="font-semibold text-gray-600">Client</span>
                </div>
              </div>
              <button disabled={loading} className='w-full bg-[#1E2128] p-3 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                {loading ? 'Loading...' : 'Sign Up'}
              </button>
              <OAuth />
            </form>
            <div className="flex gap-2 mt-5">
              <p>Have an account?</p>
              <Link to={'/sign-in'}>
                <span className="text-blue-700">Sign in</span> 
              </Link>
            </div>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
      </div>
    );
};

export default SignUp;
