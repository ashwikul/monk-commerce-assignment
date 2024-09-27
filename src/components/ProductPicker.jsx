import React from "react";
import close from "../assets/close.svg";
import search from "../assets/search.svg";

function ProductPicker({ setProductPicker }) {
  const handleSearch = (value) => {
    console.log(value);
  };

  return (
    <div className="w-[934px] h-[1027px] bg-[#00000033] absolute top-[75px] left-[253px] rounded flex justify-center items-center">
      <div className="w-[663px] h-[612px] bg-[#FFFFFF] rounded flex flex-col">
        <header className="flex justify-between items-center border border-[#0000001A] py-3 px-5">
          <div>Select Products</div>
          <button>
            <img
              src={close}
              width={17}
              height={17}
              onClick={() => setProductPicker(false)}
            />
          </button>
        </header>
        <nav className=" py-3 px-5 border border-[#0000001A]">
          <div className="flex relative w-full h-8">
            <img
              src={search}
              width={17}
              height={17}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4"
            />
            <input
              placeholder="Search product"
              className="w-full pl-10 py-2 border border-gray-300 focus:outline-none font-normal text-sm"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </nav>
        <div className="flex-grow overflow-auto">
          <ul>
            <li>product 1</li>
            <li>product 2</li>
          </ul>
        </div>
        <footer className="flex justify-between items-center py-3 px-5  sticky bottom-0 h-12 border border-[#0000001A]">
          <p>0 product selected</p>
          <div className="flex gap-2">
            <button
              className="border border-[#00000066] text-[#00000066] h-8 w-[104px] rounded"
              onClick={() => setProductPicker(false)}
            >
              Cancel
            </button>
            <button
              className="border-2 border-[#008060] bg-[#008060] text-white h-8 w-[72px] rounded"
              onClick={() => {
                setProductPicker(false);
              }}
            >
              Add
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default ProductPicker;
