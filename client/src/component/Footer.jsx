import { FaHouseChimney } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FiFacebook } from "react-icons/fi";
import { FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <div className='bg-[#000000] sm:px-28 px-3 py-10'>
         <div className='flex flex-wrap items-center gap-4 justify-between'>
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap gap-1 items-center'>
                <span className='text-[#dfad39]'>Finder</span>
                <FaHouseChimney className='text-[#dfad39]'/>
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
                <button className='w-full bg-[#dfad39]  px-3 py-2 rounded-md text-white'>Get Started</button>
            </div>
         </div>
         
        <div className="sm:flex items-center sm:justify-center justify-start gap-3 mt-4">
            <button className="rounded-full bg-[#dfad39] text-blact p-1"><FaXTwitter/></button>
            <button className="rounded-full bg-[#dfad39] text-blact p-1"><FiFacebook/></button>
            <button className="rounded-full bg-[#dfad39] text-blact p-1"><FaLinkedinIn/></button>
        </div>

    </div>
  )
}

export default Footer