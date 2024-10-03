import React, { useState } from "react";
import dots from "../assets/dots.svg";
import edit from "../assets/edit.svg";
import close from "../assets/close.svg";
import carret from "../assets/carret.svg";
import ProductPicker from "./ProductPicker";
import show from "../assets/show.svg";
import Variant from "./Variant";
import {
  handleDragOver,
  handleDragStart,
  handleOnDrop,
} from "../utils/helpers";

function Product({
  index,
  product,
  order,
  selectedProducts,
  setSelectedProducts,
  addProduct,
  addedProducts,
  setAddedProducts,
}) {
  const [productPicker, setProductPicker] = useState(false);
  const [variantsExpanded, setVariantsExpanded] = useState(false);
  const [draggedSubIndex, setDraggedSubIndex] = useState(null);

  // Function to update discount value of a product
  const updateDiscount = (product, value) => {
    const list = [...addedProducts];
    const newList = list.map((p) => {
      if (product.id === p.id) {
        return { ...p, discount: value };
      } else return p;
    });
    setAddedProducts(newList);
  };

  // Function to update discount type (percent/flat) of a product
  const updateDiscountType = (product, value) => {
    const list = [...addedProducts];
    const newList = list.map((p) => {
      if (p.id === product.id) {
        return { ...p, discountType: value };
      } else return p;
    });
    setAddedProducts(newList);
  };

  // Function to apply a discount to the product
  const handleDiscount = (product) => {
    const list = [...addedProducts];
    const updatedList = list.map((p) => {
      if (p.id) {
        if (p.id === product.id) {
          return {
            ...p,
            discountApplied: true,
          };
        } else return p;
      } else {
        return p;
      }
    });
    setAddedProducts(updatedList);
  };

  // Function to remove a product from the added products list
  const handleDelete = (index) => {
    const addedProductsCopy = [...addedProducts];

    addedProductsCopy.splice(index, 1);
    setAddedProducts(addedProductsCopy);

    setVariantsExpanded(false);
  };

  return (
    <div>
      <div className="flex items-center mt-8 mb-4 gap-1 sm:gap-2 font-normal text-sm text-[#000000CC]">
        <img src={dots} width={7} height={14} alt="dots" />
        <div>{order}.</div>
        <div className="border border-[#00000012] shadow-[0px_2px_4px_0px_#0000001A] w-52 h-8 flex justify-between items-center py-1.5 px-2.5 bg-white ">
          <div
            className={product.title ? "text-[#000000CC]" : "text-[#00000080]"}
          >
            {product.title || "Select Product"}
          </div>
          <img
            src={edit}
            alt="edit"
            width={16}
            height={16}
            onClick={() => {
              setProductPicker(true);
              setSelectedProducts([]);
            }}
            className="cursor-pointer"
          />
        </div>

        {product.discountApplied ? (
          <div className=" h-8 flex gap-1">
            <input
              type="number"
              className="w-12 sm:w-16 h-8 border border-[#0000001A] bg-white shadow-[0px_2px_4px_0px_#0000001A] pl-3"
              value={product.discount || ""}
              onChange={(e) => updateDiscount(product, e.target.value, index)}
            ></input>
            <select
              className="w-16 sm:w-24 h-8 border border-[#0000001A] bg-white shadow-[0px_2px_4px_0px_#0000001A] px-1 sm:px-3"
              onChange={(e) =>
                updateDiscountType(product, e.target.value, index)
              }
              value={product.discountType || "percent"}
            >
              <option
                className="font-normal text-sm text-[#000000CC]"
                value="percent"
              >
                % off
              </option>
              <option
                className="font-normal text-sm text-[#000000CC]"
                value="flat"
              >
                flat off
              </option>
            </select>
          </div>
        ) : (
          <button
            className={`border-2 w-28 sm:w-36 h-8 rounded text-sm font-semibold ${
              product.id
                ? "border-[#008060] bg-[#008060] text-white"
                : "border-gray-300 bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            onClick={() => handleDiscount(product, index)}
            disabled={!product.id}
          >
            Add Discount
          </button>
        )}
        {addedProducts.length > 1 && (
          <img
            src={close}
            alt="close"
            width={11.67}
            height={11.67}
            onClick={() => handleDelete(index)}
            className="cursor-pointer"
          />
        )}
        {productPicker && (
          <ProductPicker
            index={index}
            setProductPicker={setProductPicker}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            addProduct={addProduct}
            addedProducts={addedProducts}
          />
        )}
      </div>

      {product?.variants &&
        product.variants.length > 0 &&
        (variantsExpanded ? (
          <div className="flex justify-end gap-1 mb-[15px]">
            <p
              className="text-[#006EFF] text-xs font-normal underline cursor-pointer"
              onClick={() => setVariantsExpanded(false)}
            >
              Hide variants
            </p>
            <img src={carret} alt="carret" width={11} height={21} />
          </div>
        ) : (
          <div className="flex justify-end gap-1 mb-[20px] ">
            <p
              className="text-[#006EFF] text-xs font-normal underline cursor-pointer"
              onClick={() => setVariantsExpanded(true)}
            >
              Show variants
            </p>
            <img src={show} alt="show" width={11} height={21} />
          </div>
        ))}

      {/* show variants */}

      {variantsExpanded && product?.variants && (
        <ul className="ml-8 md:ml-12 ">
          {product.variants.map((variant, i) => (
            <li
              key={i}
              draggable
              onDragStart={(e) => handleDragStart(setDraggedSubIndex, i, e)}
              onDragOver={(e) => handleDragOver(draggedSubIndex, i, e)}
              onDrop={() =>
                handleOnDrop(
                  product,
                  i,
                  draggedSubIndex,
                  addedProducts,
                  setAddedProducts,
                  setDraggedSubIndex,
                  true
                )
              }
              className="cursor-move"
            >
              <Variant
                key={variant.id}
                index={i}
                variant={variant}
                product={product}
                addedProducts={addedProducts}
                setAddedProducts={setAddedProducts}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Product;
