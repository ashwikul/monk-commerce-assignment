import React, { useEffect, useState } from "react";
import dots from "../assets/dots.svg";
import edit from "../assets/edit.svg";
import close from "../assets/close.svg";
import carret from "../assets/carret.svg";
import ProductPicker from "./ProductPicker";
import show from "../assets/show.svg";
import Variant from "./Variant";

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

  const updateDiscount = (product, value) => {
    const list = [...addedProducts];
    const newList = list.map((p) => {
      if (product.id === p.id) {
        return { ...p, discount: value };
      } else return p;
    });
    setAddedProducts(newList);
  };

  const updateDiscountType = (product, value) => {
    const list = [...addedProducts];
    const newList = list.map((p) => {
      if (p.id === product.id) {
        return { ...p, discountType: value };
      } else return p;
    });
    setAddedProducts(newList);
  };

  // console.log("products", addedProducts);

  const handleDiscount = (product) => {
    const list = [...addedProducts];
    const updatedList = list.map((p) => {
      if (p.id === product.id) {
        return {
          ...p,
          discountApplied: true,
        };
      } else return p;
    });
    setAddedProducts(updatedList);
  };

  const handleDelete = (product) => {
    const addedProductsCopy = [...addedProducts];
    const updatedAddedProducts = addedProductsCopy.filter(
      (p) => p.id !== product.id
    );
    setAddedProducts(updatedAddedProducts);
  };

  return (
    <div>
      <div className="flex justify-between items-center my-[32px] gap-3">
        <img src={dots} />
        <div>{order}.</div>

        <div className="border border-[#00000012] shadow-[0px_2px_4px_0px_#0000001A] w-96 h-8 flex justify-between items-center py-[7px] px-[10px]">
          <div className="text-[#00000080] font-normal text-sm">
            {product.title || "Select Product"}
          </div>
          <img
            src={edit}
            width={16}
            height={16}
            onClick={() => {
              setProductPicker(true);
              setSelectedProducts([]);
            }}
          />
        </div>

        {product.discountApplied ? (
          <div className="w-36 h-8 flex gap-2">
            <input
              type="number"
              className="w-[69px] h-8 border border-[#0000001A]"
              value={product.discount || " "}
              onChange={(e) => updateDiscount(product, e.target.value)}
            ></input>
            <select
              className="w-24 h-8 border border-[#0000001A]"
              onChange={(e) => updateDiscountType(product, e.target.value)}
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
            <img
              src={close}
              width={11.67}
              height={11.67}
              onClick={() => handleDelete(product)}
            />
          </div>
        ) : (
          <button
            className="border-2 border-[#008060] w-36 h-8 rounded bg-[#008060] text-white font-semibold text-sm"
            onClick={() => handleDiscount(product)}
          >
            Add Discount
          </button>
        )}

        {productPicker && (
          <ProductPicker
            index={index}
            setProductPicker={setProductPicker}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            addProduct={addProduct}
          />
        )}
      </div>

      {product?.variants &&
        (variantsExpanded ? (
          <div
            className="flex justify-end gap-1 mb-[20px]"
            onClick={() => setVariantsExpanded(false)}
          >
            <p className="text-[#006EFF] text-xs font-normal underline">
              Hide variants
            </p>
            <img src={carret} width={11} height={21} />
          </div>
        ) : (
          <div
            className="flex justify-end gap-1 mb-[20px]"
            onClick={() => setVariantsExpanded(true)}
          >
            <p className="text-[#006EFF] text-xs font-normal underline">
              Show variants
            </p>
            <img src={show} width={11} height={21} />
          </div>
        ))}

      {/* show variants */}

      {variantsExpanded && product?.variants && (
        <ul className="ml-10">
          {product.variants.map((variant, index) => (
            <li key={index}>
              <Variant
                key={variant.id}
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
