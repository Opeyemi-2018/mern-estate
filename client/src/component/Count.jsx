import { useEffect } from "react";

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
    <div className="bg-black text-white px-4 sm:my-6 my-4 py-4">
      <div className="flex justify-between flex-wrap items-center max-w-6xl mx-auto">
        <div className="flex flex-col items-center">
          <span
            className="counter sm:text-2xl text-1xl font-semibold"
            data-target="300"
          >
            0
          </span>
          <span className="text-gray-400">satisfied clients</span>
        </div>
        <div className="flex flex-col items-center">
          <span
            className="counter sm:text-2xl text-1xl font-semibold"
            data-target="300"
          >
            0
          </span>
          <span className="text-gray-400">Houses for sell</span>
        </div>
        <div className="flex flex-col items-center">
          <span
            className="counter sm:text-2xl text-1xl font-semibold"
            data-target="300"
          >
            0
          </span>
          <span className="text-gray-400">Houses for rent</span>
        </div>
        <div className="flex flex-col items-center">
          <span
            className="counter sm:text-2xl text-1xl font-semibold"
            data-target="300"
          >
            0
          </span>
          <span className="text-gray-400">Agents</span>
        </div>
      </div>
    </div>
  );
};

export default Count;
