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

  return (
    <div className="flex items-center my-[32px] gap-3">
      <img src={dots} />
      <div className="border border-[#00000012] shadow-[0px_2px_4px_0px_#0000001A] w-full h-8 flex justify-between items-center py-[7px] px-[10px] rounded-[30px]">
        <div className="text-[#00000080] font-normal text-sm">
          {variant.title || "Select Product"}
        </div>
      </div>
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
