import React from "react";

const SearchProperty = () => {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="">
      <form className="bg-white py-4 px-2 rounded-md max-w-5xl mx-auto sm:px-10 sm:w-full w-[350px]">
        <div className="flex md:flex-row flex-col md:gap-0 gap-3 items-center justify-between mb-5">
          <input
            type="text"
            className="p-2 w-full  bg-gray-100 outline-none border-r-2"
            placeholder="apartment type"
          />
          <input
            type="text"
            className="p-2 w-full border-none outline-none bg-gray-100"
            placeholder="location"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollToSection("saleSection")}
              className="hover:bg-red-800 bg-red-600 text-white w-[60px] py-[3px] px-2 rounded-sm"
            >
              Buy
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("rentSection")}
              className="bg-gray-200 w-[60px] py-[3px] px-2 rounded-sm"
            >
              Rent
            </button>
          </div>
          <button className="bg-[#1E2128] py-[3px] px-3 text-white rounded-sm">
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchProperty;
