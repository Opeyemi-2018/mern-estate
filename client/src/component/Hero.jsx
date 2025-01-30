import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import imgOne from "../assets/images/img-1.jpg";
import imgTwo from "../assets/images/img-2.jpg";
import HeroImage from "../assets/images/hero-image.jpeg";
import HeroImageOne from "../assets/images/hero-image1.png";
import HeroImageTwo from "../assets/images/hero-image2.png";
import SearchProperty from "./SearchProperty";

const HeroContent = [
  {
    image: imgOne,
    title: "Find your next place with ease",
    description:
      "Finder is the best place to find your next perfect place to live.",
  },
  {
    image: imgTwo,
    title: "A new phase of sustainable living",
    description:
      "Elevate your living experience, your dream home has a new address.",
  },
  {
    image: HeroImage,
    title: "An aspiring address called home",
    description:
      "A leading sustainable residential housing development company.",
  },
];

const Hero = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % HeroContent.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`relative w-full h-[460px] flex items-center flex-col gap-10 justify-center 
                bg-black/80 bg-blend-darken transition-all duration-1000 ease-in-out`}
      style={{
        backgroundImage: `url(${HeroContent[index].image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* <div className="flex items-center justify-center py-28 px-3"> */}
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 1 }}
        className="text-center text-white "
      >
        <h1 className="text-3xl lg:text-6xl font-bold px-2">
          {HeroContent[index].title}
        </h1>
        <p className="text-lg mt-4">{HeroContent[index].description}</p>
      </motion.div>
      <div>
        <SearchProperty />
      </div>
    </div>
  );
};

export default Hero;
