import React, { useEffect, useState } from "react";
import SearchProperty from "../component/SearchProperty";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { Link } from "react-router-dom";
import HeroImage from "../assets/images/hero-image.jpeg";

const Rent = () => {
  const [rents, setRent] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSellListing = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/listing/get?type=rent");
        if (!res.ok) {
          throw new Error("unable to fetch");
        }
        const data = await res.json();
        setRent(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSellListing();
  }, []);

  return (
    <div className="min-h-screen ">
      <div
        className={`relative w-full h-[200px] flex items-center flex-col gap-10 justify-center 
                bg-black/80 bg-blend-darken transition-all duration-1000 ease-in-out`}
        style={{
          backgroundImage: `url(${HeroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex  px-3 items-center text-white justify-center flex-col gap-3 my-10">
          <h1 className=" text-3xl  ">Here are numerous properties to Let</h1>
          <button className="p-3 bg-red-600  border-white border-2 text-white hover:bg-red-700 rounded-full">
            Contact and agent today!!
          </button>
        </div>
      </div>

      {loading ? (
        <div className="spinner mt-20 flex items-center justify-center">
          <ClipLoader color="blue" size={50} loading={loading} />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto my-6">
          <h1 className="sm:text-3xl px-3 text-2xl py-4 text-[#1E2128]">
            To Let property
          </h1>
          <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
            {rents.map((rent) => {
              const {
                imageUrls,
                name,
                regularPrice,
                _id,
                bathrooms,
                bedrooms,
              } = rent;
              return (
                <Link to={`/listing/${_id}`} className="shadow-md ">
                  <img
                    src={imageUrls}
                    className="h-[200px] w-full object-cover sm:rounded-md"
                    alt=""
                  />

                  <div className="rounded-md p-2">
                    <div className="flex items-center justify-between mt-3">
                      <h1 className=" text-gray-700">{name.slice(0, 20)}</h1>
                      <h1 className=" text-gray-700">{regularPrice}</h1>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-slate-700 flex items-center gap-4">
                        <div className="font-bold text-xs">
                          {bedrooms > 1
                            ? `${bedrooms} beds `
                            : `${bedrooms} bed `}
                        </div>

                        <div className="font-bold text-xs">
                          {bathrooms > 1
                            ? `${bathrooms} baths `
                            : `${bathrooms} xxxxxxxxxxxx bath `}
                        </div>
                      </div>
                      <MdOutlineFavoriteBorder
                        size={25}
                        className=" text-gray-500"
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Rent;
