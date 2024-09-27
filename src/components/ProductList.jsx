import React from "react";
import logo from "../assets/logo.png";

function ProductList() {
  return (
    <div>
      <nav className="border border-[#D1D1D1] py-[8px] pl-[21px]">
        <ul className="flex items-center gap-4">
          <li>
            <img src={logo} alt="monk commerce logo" />
          </li>
          <li className="text-base font-semibold text-[#7E8185]">
            Monk Upsell & Cross-sell
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default ProductList;
