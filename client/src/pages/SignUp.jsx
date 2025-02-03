import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../component/OAuth";
import signUpImage from "../assets/images/sign-up.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

const SignUp = () => {
  let [loading, setLoading] = useState(false);
  let [formData, setFormData] = useState({});
  const fileRef = useRef();
  console.log(formData);

  let navigate = useNavigate();

  const uploadImage = () => {
    fileRef.current.click();
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  let handleChange = (e) => {
    const { id, type, checked, value } = e.target;

    if (type === "radio") {
      // When a checkbox is clicked, update the formData to ensure only one is true
      if (id === "agent") {
        setFormData({ ...formData, isAgent: checked, isClient: !checked });
      } else if (id === "client") {
        setFormData({ ...formData, isClient: checked, isAgent: !checked });
      }
    } else {
      // Handle other inputs (username, email, password)
      setFormData({ ...formData, [id]: value });
    }
    console.log(formData);
  };
  const submissionData = {
    ...formData,
    username: formData.username?.toLowerCase(),
    email: formData.email?.toLowerCase(),
  };

  let handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      toast.error("All fields are required", {
        pauseOnHover: false,
        draggable: true,
      });
      return;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address", {
        pauseOnHover: false,
        draggable: true,
      });
      return;
    }

    // Validate Password (at least 8 characters, one uppercase, one number, one special character)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error(
        "Password must be at least 8 characters long, with at least one uppercase letter, one number, and one special character",
        {
          pauseOnHover: false,
          draggable: true,
        }
      );
      return;
    }

    // Check if either "Agent" or "Client" is selected
    if (!formData.isAgent && !formData.isClient) {
      toast.error("Please select agent or client", {
        pauseOnHover: false,
        draggable: true,
      });
      return;
    }

    if (!formData.image) {
      toast.error("Please upload an image", {
        pauseOnHover: false,
        draggable: true,
      });
      return;
    }

    try {
      setLoading(true);
      let res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });
      let data = await res.json();
      if (data.success === false) {
        toast.error(data.message, {
          pauseOnHover: false,
          draggable: true,
        });
        setLoading(false);
        return;
      }
      setLoading(false);
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      toast.error(error.message, {
        pauseOnHover: false,
        draggable: true,
      });
    }
  };

  return (
    <div className="sm:px-28 px-3 py-5 min-h-screen">
      <div className="absolute left-1/2 top-16 z-10 transform -translate-y-1/2 -translate-x-1/2">
        <ToastContainer position="top-center" autoClose={5000} />
      </div>{" "}
      <div className="flex gap-10 justify-between">
        <img
          src={signUpImage}
          alt="Sign Up"
          className="flex-1 sm:inline hidden rounded-lg w-40 h-[500px] cover/center"
        />
        <div className="flex-1">
          <h1 className="text-3xl text-[#1E2128] font-semibold mb-3">
            Welcome to Finder
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              id="username"
              autoComplete="off"
              placeholder="Username"
              className="w-full border  p-3 outline-none rounded-lg shadow-sm"
              onChange={handleChange}
            />
            <input
              type="text"
              id="email"
              placeholder="Email"
              autoComplete="off"
              className="w-full border p-3 outline-none rounded-lg shadow-sm"
              onChange={handleChange}
            />
            <input
              type="password"
              id="password"
              placeholder="Password"
              autoComplete="off"
              className="w-full border p-3 outline-none rounded-lg shadow-sm"
              onChange={handleChange}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="group-1"
                    id="agent"
                    className="w-5 h-5"
                    onChange={handleChange}
                    checked={formData.isAgent || false}
                  />
                  <span className="font-semibold text-gray-600">Agent</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="group-1"
                    id="client"
                    className="w-5 h-5"
                    onChange={handleChange}
                    checked={formData.isClient || false}
                  />
                  <span className="font-semibold text-gray-600">Client</span>
                </div>
              </div>

              <div>
                <input
                  type="file"
                  className="hidden"
                  ref={fileRef}
                  onChange={handleImageChange}
                />
                <button
                  type="button"
                  onClick={uploadImage}
                  className="bg-gray-50 p-2 rounded-md text-black hover:bg-gray-300 border border-gray-700"
                >
                  Add your image
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-[#1e2128] p-3 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            >
              {loading ? (
                <div className="spinner  flex items-center justify-center">
                  <ClipLoader color="blue" size={25} loading={loading} />
                </div>
              ) : (
                "Sign Up"
              )}
            </button>

            <OAuth />
          </form>
          <div className="flex gap-2 mt-5">
            <p>Have an account?</p>
            <Link to={"/sign-in"}>
              <span className="text-blue-700">Sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
