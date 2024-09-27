import React, { useState } from "react";
import logo from "../assets/logo.png";
import Product from "./Product";

function ProductList() {
  const [addedProducts, setAddedProducts] = useState([{}]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  let order = 1;

  const addEmptyProduct = () => {
    const list = [...addedProducts];
    list.push({});
    setAddedProducts(list);
  };

  console.log("selected products", selectedProducts);

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
      <main className="ml-[321px] mt-[115px]">
        <h4 className="mb-[84px]">Add Products</h4>
        <div className="w-fit">
          <div className="flex">
            <div className="w-[215px] text-center">Product</div>
            <div className="w-[215px] text-center">Discount</div>
          </div>
          <ul>
            {addedProducts.map((product, index) => {
              return (
                <li key={index}>
                  <Product
                    index={index}
                    order={order++}
                    selectedProducts={selectedProducts}
                    setSelectedProducts={setSelectedProducts}
                  />
                </li>
              );
            })}
          </ul>

          <div className="flex justify-end">
            <button
              className="border-2 border-[#008060] w-48 h-12 rounded text-[#008060] font-semibold text-sm"
              onClick={addEmptyProduct}
            >
              Add Product
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductList;
