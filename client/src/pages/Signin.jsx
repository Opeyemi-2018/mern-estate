import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../component/OAuth";
import signInImage from "../assets/images/sign-in.png";
const Signin = () => {
  let { loading, error } = useSelector((state) => state.user);
  let [formData, setFormData] = useState({});
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let handleChange = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
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
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="sm:px-28 px-3 py-10  mt-20 min-h-screen">
      <div className="flex gap-10 justify-between">
        {/* <div className=""> */}
        <img
          src={signInImage}
          alt=""
          className="sm:inline hidden rounded-lg flex-1 w-40 h-[500px] cover/center"
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
              id="email"
              placeholder="email"
              className="w-full border p-3 rounded-lg shadow-sm"
              onChange={handleChange}
            />
            <input
              type="password"
              id="password"
              placeholder="password"
              className="w-full border p-3 rounded-lg shadow-sm"
              onChange={handleChange}
            />
            <button
              disabled={loading}
              className="w-full bg-[#001030] p-3 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            >
              {loading ? "Loading" : "Sign in"}
            </button>
            <OAuth />
          </form>
          <div className="flex gap-2 mt-5">
            <p>Dont Have an account</p>
            <Link to={"/sign-up"}>
              <span className="text-blue-700">Sign Up</span>
            </Link>
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Signin;

//2:01
