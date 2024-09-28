import React from "react";
import dots from "../assets/dots.svg";
import close from "../assets/close.svg";

function Variant({ index, variant, product, addedProducts, setAddedProducts }) {
  const handleDelete = (product, variant, index) => {
    const addedProductsCopy = [...addedProducts];
    const variantList = addedProductsCopy.find(
      (p, i) => p.id === product.id && i === index
    ).variants;
    const updatedVariantList = variantList.filter((v) => v.id !== variant.id);
    const updatedAddedProdusts = addedProductsCopy.map((p, i) => {
      if (p.id === product.id && index === i) {
        return {
          ...p,
          variants: updatedVariantList,
        };
      } else return p;
    });
    setAddedProducts(updatedAddedProdusts);
  };

  const updateDiscount = (product, variant, value, index) => {
    const list = [...addedProducts];
    const newList = list.map((p, i) => {
      if (product.id === p.id && index === i) {
        return {
          ...p,
          variants: p.variants.map((v) => {
            if (v.id === variant.id) {
              return { ...v, discount: value };
            } else return v;
          }),
        };
      } else return p;
    });
    setAddedProducts(newList);
  };

  const updateDiscountType = (product, variant, value, index) => {
    const list = [...addedProducts];
    const newList = list.map((p, i) => {
      if (product.id === p.id && index === i) {
        return {
          ...p,
          variants: p.variants.map((v) => {
            if (v.id === variant.id) {
              return { ...v, discountType: value };
            } else return v;
          }),
        };
      } else return p;
    });
    setAddedProducts(newList);
  };

  return (
    <div className="flex items-center my-8 gap-2 font-normal text-sm text-[#000000CC]">
      <img src={dots} width={7} height={14} alt="dots" />
      <div
        className={`border border-[#00000012] shadow-[0px_2px_4px_0px_#0000001A] h-8 flex justify-between items-center py-[7px] px-[10px] rounded-[30px] ${
          product.discountApplied ? "w-44" : "w-full"
        }  `}
      >
        <div>{variant.title || "Select Product"}</div>
      </div>
      {product.discountApplied && (
        <div className=" h-8 flex gap-1">
          <input
            type="number"
            className="w-12 sm:w-16 h-8 border border-[#0000001A] rounded-[30px] shadow-[0px_2px_4px_0px_#0000001A] pl-4"
            value={variant.discount || " "}
            onChange={(e) =>
              updateDiscount(product, variant, e.target.value, index)
            }
          ></input>
          <select
            className="w-16 sm:w-24 h-8 border border-[#0000001A] rounded-[30px] shadow-[0px_2px_4px_0px_#0000001A] px-1 sm:px-3"
            onChange={(e) =>
              updateDiscountType(product, variant, e.target.value, index)
            }
            value={variant.discountType || "percent"}
          >
            <option value="percent">% off</option>
            <option value="flat">flat off</option>
          </select>
        </div>
      )}
      <img
        src={close}
        alt="close"
        className="cursor-pointer"
        width={11.67}
        height={11.67}
        onClick={() => handleDelete(product, variant, index)}
      />
    </div>
  );
}

export default Variant;
