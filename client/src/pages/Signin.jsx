import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/userSlice";
import OAuth from "../component/OAuth";
import signInImage from "../assets/images/sign-in.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
const Signin = () => {
  let { loading, error } = useSelector((state) => state.user);
  let [formData, setFormData] = useState({});
  let navigate = useNavigate();
  let dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error, {
        pauseOnHover: false,
        draggable: true,
      });
    }
  }, [error]);

  let handleChange = (e) => {
    const { id, value } = e.target;
    const formattedValue =
      id === "email" || id === "name" ? value.toLowerCase() : value;
    setFormData({
      ...formData,
      [e.target.id]: formattedValue,
    });
  };
  let handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      let res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      let data = await res.json();
      // console.log("API Response:", data);

      if (!res.ok) {
        dispatch(signInFailure(data.message || "Sign-in failed"));
        toast.error(data.message || "Sign-in failed", {
          pauseOnHover: false,
          draggable: true,
        });
        return;
      }
      localStorage.setItem("user", JSON.stringify(data));
      if (data.token) {
        localStorage.setItem("access_token", data.token);
      }
      dispatch(signInSuccess(data.user));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
      toast.error(error.message, {
        pauseOnHover: false,
        draggable: true,
      });
    }
  };

  return (
    <div className="sm:px-28 px-3 py-5   min-h-screen">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        toastClassName="w-[250px] text-center"
      />
      <div className="flex gap-10 justify-between">
        {/* <div className=""> */}
        <img
          src={signInImage}
          alt=""
          className="md:inline hidden rounded-lg flex-1 w-40 h-[500px] cover/center"
        />
        {/* </div> */}
        <div className="flex-1">
          <h1 className="text-3xl text-[#1E2128] font-semibold my-7">
            Sign in to your account
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex items-start flex-col gap-4"
          >
            <input
              type="text"
              autoComplete="off"
              id="email"
              placeholder="email"
              className="w-full border p-3 outline-none rounded-lg shadow-sm"
              onChange={handleChange}
            />
            <input
              autoComplete="off"
              type="password"
              id="password"
              placeholder="password"
              className="w-full border p-3 outline-none rounded-lg shadow-sm"
              onChange={handleChange}
            />
            <button
              disabled={loading}
              className="w-full bg-[#1e2128] p-3 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            >
              {loading ? (
                <div className="spinner  flex items-center justify-center">
                  <ClipLoader color="blue" size={25} loading={loading} />
                </div>
              ) : (
                "Sign in"
              )}
            </button>
            <OAuth />
          </form>
          <div className="flex gap-2 mt-5">
            <p>Dont Have an account</p>
            <Link to={"/sign-up"}>
              <span className="text-blue-700">Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;

//2:01
