import React, { useState } from "react";
import logo from "../assets/logo.png";
import Product from "./Product";
import {
  handleDragOver,
  handleDragStart,
  handleOnDrop,
} from "../utils/helpers";

function ProductList() {
  const [addedProducts, setAddedProducts] = useState([{}]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);

  let order = 1;

  const addEmptyProduct = () => {
    const list = [...addedProducts];
    list.push({});
    setAddedProducts(list);
  };

  const addProduct = (index) => {
    if (selectedProducts.length === 0) {
      return;
    }
    const list = [...addedProducts];
    list.splice(index, 1, ...selectedProducts);
    setAddedProducts(list);
  };

  console.log(addedProducts);

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
      <div className="w-fit ml-[321px] mt-[60px]">
        <h4 className="mb-[20px] text-left font-semibold text-[#202223] text-base">
          Add Products
        </h4>
        <div className="flex font-medium text-sm text-[#000000E5] text-center">
          <div className="w-[215px]">Product</div>
          <div className="w-36">Discount</div>
        </div>
        <ul>
          {addedProducts.map((product, index) => {
            return (
              <li
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(setDraggedIndex, index, e)}
                onDragOver={(e) => handleDragOver(draggedIndex, index, e)}
                onDrop={() =>
                  handleOnDrop(
                    product,
                    index,
                    draggedIndex,
                    addedProducts,
                    setAddedProducts,
                    setDraggedIndex,
                    false
                  )
                }
              >
                <Product
                  index={index}
                  product={product}
                  order={order++}
                  selectedProducts={selectedProducts}
                  setSelectedProducts={setSelectedProducts}
                  addProduct={addProduct}
                  addedProducts={addedProducts}
                  setAddedProducts={setAddedProducts}
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
    </div>
  );
}

export default ProductList;
