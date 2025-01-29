import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import designOne from "../assets/images/design-1.jpg";
import designTwo from "../assets/images/design-2.jpg";
import HeroImage from "../assets/images/hero-image.jpeg";

const HeroContent = [
  {
    image: designOne,
    title: "Find your next place with ease",
    description:
      "Finder is the best place to find your next perfect place to live. We have a wide range of properties for you to choose from.",
  },
  {
    image: designTwo,
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
      className="relative w-full h-[400px] flex items-center justify-center"
      style={{
        background: `linear-gradient(to bottom, rgba(20, 45, 75, 1) 0%, rgba(18, 50, 80, 0.8) 60%, rgba(15, 55, 85, 0.3) 90%), url(${HeroContent[index].image}) center/cover no-repeat`,
        transition: "background 1s ease-in-out",
      }}
    >
      {/* <div className="flex items-center justify-center py-28 px-3"> */}
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 1 }}
        className="text-center text-white max-w-6xl px-4"
      >
        <h1 className="text-3xl lg:text-6xl font-bold">
          {HeroContent[index].title}
        </h1>
        <p className="text-lg mt-4">{HeroContent[index].description}</p>
      </motion.div>
    </div>
    // </div>
  );
};

export default Hero;
