import { useEffect } from "react";
import { PiUsersThree } from "react-icons/pi";
import { MdSupportAgent } from "react-icons/md";
import { BsHouse } from "react-icons/bs";
import { FaHouseChimney } from "react-icons/fa6";

const Count = () => {
  useEffect(() => {
    const counters = document.querySelectorAll(".counter");

    const countUp = (counter) => {
      const target = +counter.getAttribute("data-target");
      const speed = 200; // Adjust for smoother or faster animation
      const increment = target / speed;

      let currentValue = 0;
      const updateCount = () => {
        currentValue += increment;
        if (currentValue < target) {
          counter.innerText = Math.ceil(currentValue);
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = `${target}+`;
        }
      };
      updateCount();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            countUp(entry.target);
            observer.unobserve(entry.target); // Stop observing once counted
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));

    return () => {
      counters.forEach((counter) => observer.unobserve(counter));
    };
  }, []);
  return (
    <div className=" text-black  sm:my-6 my-4 py-4">
      <div className="grid md:grid-cols-4 grid-cols-2 md:gap-0 gap-12 items-center max-w-6xl mx-auto">
        <div className="flex flex-col items-center">
          <span className="counter text-2xl  font-semibold" data-target="300">
            0
          </span>
          <PiUsersThree size={25} className="" />
          <span className="text-[18px]">satisfied clients</span>
        </div>
        <div className="flex flex-col items-center">
          <span
            className="counter text-2xl text-1xl font-semibold"
            data-target="600"
          >
            0
          </span>
          <BsHouse size={25} />
          <span className="text-[18px]">Houses for sell</span>
        </div>
        <div className="flex flex-col items-center">
          <span
            className="counter text-2xl text-1xl font-semibold"
            data-target="300"
          >
            0
          </span>
          <FaHouseChimney size={25} />
          <span className="text-[18px]">Houses for rent</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="counter text-2xl  font-semibold" data-target="100">
            0
          </span>
          <MdSupportAgent size={25} />
          <span className="text-[18px]">Agents</span>
        </div>
      </div>
    </div>
  );
};

export default Count;
