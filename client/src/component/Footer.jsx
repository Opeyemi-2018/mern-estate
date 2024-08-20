import { FaHouseChimney } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FiFacebook } from "react-icons/fi";
import { FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className='bg-[#001030] sm:px-28 px-3 py-10'>
        <div className='flex flex-wrap items-center gap-4 justify-between'>
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap gap-1 items-center'>
                <span className='text-white'>Finder</span>
                <FaHouseChimney className='text-white'/>
            </h1>

            <div className="flex flex-col gap-3">
                <ul className='flex items-center gap-4 text-white'>
                    <li>about</li>
                    <li>listings</li>
                    <li>services</li>
                </ul>
                <hr />
            </div>

            <div>
                <Link to={'/search'} className='w-full bg-white  px-3 py-2 rounded-md text-[#1E2128]'>Get Started</Link>
            </div>
         </div>
         
        <div className="flex items-center sm:justify-center justify-start sm:gap-10 gap-5 mt-4">
          <p className="text-white"> © {new Date().getFullYear()} Your Company</p>
            <button className="rounded-full bg-white  p-1"><FaXTwitter/></button>
            <button className="rounded-full bg-white  p-1"><FiFacebook/></button>
            <button className="rounded-full bg-white  p-1"><FaLinkedinIn/></button>
        </div>

    </div>
  )
}

export default Footer