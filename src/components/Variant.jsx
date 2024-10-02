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

    let updatedAddedProdusts;
    if (updatedVariantList.length === 0) {
      updatedAddedProdusts = addedProductsCopy.filter(
        (p, i) => p.id !== product.id
      );
    } else {
      updatedAddedProdusts = addedProductsCopy.map((p, i) => {
        if (p.id === product.id && index === i) {
          return {
            ...p,
            variants: updatedVariantList,
          };
        } else return p;
      });
    }

    if (updatedAddedProdusts.length === 0) {
      return setAddedProducts([{}]);
    }
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

  const handleDiscount = (product, variant) => {
    const list = [...addedProducts];
    const newList = list.map((p, i) => {
      if (product.id === p.id) {
        return {
          ...p,
          variants: p.variants.map((v) => {
            if (v.id === variant.id) {
              return { ...v, discountApplied: true };
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
        className={`border border-[#00000012] shadow-[0px_2px_4px_0px_#0000001A] h-8 flex justify-between items-center py-[7px] px-[10px] rounded-[30px] w-44 `}
      >
        <div>{variant.title || "Select Product"}</div>
      </div>
      {variant.discountApplied ? (
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
      ) : (
        <button
          className={`border-2 w-28 sm:w-36 h-8 rounded text-sm font-semibold ${
            product.id
              ? "border-[#008060] bg-[#008060] text-white"
              : "border-gray-300 bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          onClick={() => handleDiscount(product, variant)}
          disabled={!product.id}
        >
          Add Discount
        </button>
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
