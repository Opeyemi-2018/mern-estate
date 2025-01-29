import React from "react";

const SearchProperty = () => {
  return (
    <div className="px-2">
      <form className="bg-white py-4 px-2 rounded-md max-w-5xl mx-auto sm:px-10 sm:w-full w-[330px]">
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
            <button className="bg-[#DBB65D] w-[60px] py-[3px] px-2 rounded-sm">
              Buy
            </button>
            <button className="bg-gray-200 w-[60px] py-[3px] px-2 rounded-sm">
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
