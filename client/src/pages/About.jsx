import { useEffect } from "react";
import aboutImage from "../assets/images/about-image.png";
import Count from "../component/Count";
import { BsFillSendFill } from "react-icons/bs";
import { MdOutlineLocalPhone } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FaRegEnvelope } from "react-icons/fa6";

export default function About() {
  return (
    <div className="  min-h-screen">
      <div className="sm:py-20 py-10 ">
        <div className="px-4 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-4  text-[#1E2128]">
            About HomyHub
          </h1>
          <p className="mb-4  text-slate-700">
            HomyHub is a leading real estate agency that specializes in helping
            clients buy, sell, and rent properties in the most desirable
            neighborhoods. Our team of experienced agents is dedicated to
            providing exceptional service and making the buying and selling
            process as smooth as possible.
          </p>
        </div>
        <img src={aboutImage} alt="" className=" h-64 object-cover  w-full" />
      </div>

      <div className=" text-gray-800 ">
        <p className="mx-auto max-w-4xl font-semibold sm:text-3xl px-4 text-2xl ">
          We can bring to life everything you've ever envisioned and dreamed of
          – your ideals and desires are our creations.
        </p>
        <hr />
      </div>

      <Count />

      <div className="py-20 px-4 max-w-6xl mx-auto">
        <h1 className="text-[#001030] text-3xl text-center sm:my-10 my-7 font-bold">
          What we offer
        </h1>
        <div className="flex items-center md:flex-row flex-col justify-center gap-4">
          <div className="bg-white p-8 hover:bg-[#2c2f36] text-[#1E2128] hover:text-white transition-all duration-300 shadow-md rounded-lg">
            <h1 className=" sm:text-2xl text-1xl">/01</h1>
            <h2 className="md:text-3xl  tex-2xl my-4 ">Looking for house</h2>
            <p className="">
              Incorporating interior detailing introduces dimension, tactile
              qualities, and captivating visual elements to a room, enhancing
              the overall design through the addition of those final
              embellishments.
            </p>
          </div>

          <div className="bg-white p-8 hover:bg-[#2c2f36] text-[#1E2128] hover:text-white transition-all duration-300 shadow-md rounded-lg">
            <h1 className=" sm:text-2xl text-1xl">/02</h1>
            <h2 className="md:text-3xl  tex-2xl my-4 ">Apartment Finding</h2>
            <p className="">
              Incorporating interior detailing introduces dimension, tactile
              qualities, and captivating visual elements to a room, enhancing
              the overall design through the addition of those final
              embellishments.
            </p>
          </div>

          <div className="bg-white p-8 hover:bg-[#2c2f36] text-[#1E2128] hover:text-white transition-all duration-300 shadow-md rounded-lg">
            <h1 className=" sm:text-2xl text-1xl">/03</h1>
            <h2 className="md:text-3xl  tex-2xl my-4 ">Interior Decoration</h2>
            <p className="">
              Incorporating interior detailing introduces dimension, tactile
              qualities, and captivating visual elements to a room, enhancing
              the overall design through the addition of those final
              embellishments.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex  md:flex-row flex-col gap-4 my-8">
        <div className="md:px-0 px-3">
          <h1 className="sm:text-2xl text-1xl font-semibold capitalize">
            get in touch with us
          </h1>
          <p className="text-gray-600 mb-2">
            contact us with your house details, if you have house to sell for us{" "}
          </p>

          <div className="flex items-center gap-3 mb-2">
            <span>
              <HiOutlineLocationMarker
                size={30}
                className="text-red-600 bg-gray-100 p-2 rounded-full"
              />
            </span>
            <div>
              <h1 className="font-semibold ">Our office address</h1>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet consectetur.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 my-4">
            <span>
              <FaRegEnvelope
                size={30}
                className="text-red-600 bg-gray-100 p-2 rounded-full"
              />
            </span>
            <div>
              <h1 className="font-semibold ">Email</h1>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet consectetur.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <span>
              <MdOutlineLocalPhone
                size={30}
                className="text-red-600 bg-gray-100 p-2 rounded-full"
              />
            </span>
            <div>
              <h1 className="font-semibold ">Phone</h1>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet consectetur.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 py-5 md:px-5 px-3 sm:rounded-sm rounded-sm flex-1">
          <h1 className="my-2 font-semibold">Looking to make an enquiry</h1>
          <form className="flex  flex-col gap-2 ">
            <input
              type="text"
              placeholder="name"
              className="p-2 bg-white rounded-sm outline-none"
            />
            <input
              type="email"
              placeholder="email"
              className="p-2 bg-white rounded-sm outline-none"
            />
            <input
              type="number"
              placeholder="contact"
              className="p-2 bg-white rounded-sm outline-none"
            />
            <textarea
              id=""
              rows={5}
              placeholder="your message"
              className="outline-none px-2"
            ></textarea>
            <button className="p-3 text-white flex items-center font-semibold justify-center capitalize gap-4 rounded-md hover:bg-red-800 bg-red-600">
              {" "}
              send message <BsFillSendFill size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
