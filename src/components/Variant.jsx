import React from "react";
import dots from "../assets/dots.svg";
import close from "../assets/close.svg";

function Variant({ variant, product, addedProducts, setAddedProducts }) {
  const handleDelete = (product, variant) => {
    const addedProductsCopy = [...addedProducts];
    const variantList = addedProductsCopy.find(
      (p) => p.id === product.id
    ).variants;
    const updatedVariantList = variantList.filter((v) => v.id !== variant.id);
    const updatedAddedProdusts = addedProductsCopy.map((p) => {
      if (p.id === product.id) {
        return {
          ...p,
          variants: updatedVariantList,
        };
      } else return p;
    });
    setAddedProducts(updatedAddedProdusts);
  };

  const updateDiscount = (product, variant, value) => {
    const list = [...addedProducts];
    const newList = list.map((p) => {
      if (product.id === p.id) {
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

  const updateDiscountType = (product, variant, value) => {
    const list = [...addedProducts];
    const newList = list.map((p) => {
      if (product.id === p.id) {
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
    <div className="flex items-center my-[32px] gap-3">
      <img src={dots} />
      <div className="border border-[#00000012] shadow-[0px_2px_4px_0px_#0000001A] w-full h-8 flex justify-between items-center py-[7px] px-[10px] rounded-[30px]">
        <div className="text-[#00000080] font-normal text-sm">
          {variant.title || "Select Product"}
        </div>
      </div>
      {product.discountApplied && (
        <div className="w-36 h-8 flex gap-2">
          <input
            type="number"
            className="w-[69px] h-8 border border-[#0000001A]"
            value={variant.discount || " "}
            onChange={(e) => updateDiscount(product, variant, e.target.value)}
          ></input>
          <select
            className="w-24 h-8 border border-[#0000001A]"
            onChange={(e) =>
              updateDiscountType(product, variant, e.target.value)
            }
            value={variant.discountType || "percent"}
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
      )}
      <img
        src={close}
        width={11.67}
        height={11.67}
        onClick={() => handleDelete(product, variant)}
      />
    </div>
  );
}

export default Variant;
