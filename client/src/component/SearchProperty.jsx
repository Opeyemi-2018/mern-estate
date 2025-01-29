import React from "react";

const SearchProperty = () => {
  return (
    <div className="">
      <form className="bg-white p-4 rounded-md ">
        <div className="flex items-center justify-between mb-5">
          <input
            type="text"
            className="p-1  bg-gray-100 outline-none border-r-2"
            placeholder="apartment type"
          />
          <input
            type="text"
            className="p-1 border-none outline-none bg-gray-100"
            placeholder="location"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button className="bg-[#DBB65D] w-[60px] py-[2px] px-2 rounded-sm">
              Buy
            </button>
            <button className="bg-gray-200 w-[60px] py-[2px] px-2 rounded-sm">
              Rent
            </button>
          </div>
          <button className="bg-[#1E2128] py-[2px] px-3 text-white rounded-sm">
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchProperty;
