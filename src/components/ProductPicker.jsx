import React, { useEffect, useState } from "react";
import close from "../assets/close.svg";
import search from "../assets/search.svg";

function ProductPicker({
  setProductPicker,
  selectedProducts,
  setSelectedProducts,
}) {
  const apiKey = process.env.REACT_APP_API_KEY;
  const [productsList, setProductsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchData(null, 0);
  }, []);

  const fetchData = async (text, pageNumber) => {
    let URL;
    if (text) {
      URL = `https://stageapi.monkcommerce.app/task/products/search?search=${text}&page=${pageNumber}&limit=10`;
    } else {
      URL = `https://stageapi.monkcommerce.app/task/products/search?page=${pageNumber}&limit=10`;
    }
    setIsLoading(true);
    try {
      const res = await fetch(URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
      });
      const data = await res.json();
      if (!data) {
        setProductsList([]);
        setIsLoading(false);
        return;
      }

      setPageNumber((prev) => prev + 1);
      setProductsList((prev) => [...prev, ...data]);
    } catch (error) {
      console.log("Error while fetching products", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProductChecked = (product) => {
    // check the products which are checked
    const productsListCopy = [...productsList];
    const updatedProductList = productsListCopy.map((p) => {
      if (p.id === product.id) {
        return {
          ...p,
          checked: !p.checked,
          variants: p.variants?.map((v) => ({
            ...v,
            checked: !p.checked,
          })),
        };
      } else {
        return p;
      }
    });
    setProductsList(updatedProductList);

    // add to the selectedProducts
    const selectedProductsCopy = [...selectedProducts];
    const isProductExisting = selectedProductsCopy.some(
      (p) => p.id === product.id
    );

    // if product is existing ,then delete from selectedproducts
    if (isProductExisting) {
      const updatedSelectedProducts = selectedProductsCopy.filter(
        (p) => p.id !== product.id
      );
      setSelectedProducts(updatedSelectedProducts);
    } else {
      // if product is not existing ,then add to the selectedproducts
      setSelectedProducts((prev) => [...prev, product]);
    }
  };

  const updateVariantChecked = (variant, product) => {
    // update checked products
    const productListCopy = [...productsList];
    const updatedProductListCopy = productListCopy.map((p) => {
      if (p.id === product.id) {
        return {
          ...p,
          variants: p.variants.map((v) => {
            if (v.id === variant.id) {
              return {
                ...v,
                checked: !v.checked,
              };
            } else {
              return v;
            }
          }),
        };
      } else {
        return p;
      }
    });
    // update parent checkbox as per childs
    const updatedProductList = updatedProductListCopy.map((p) => {
      if (p.id === product.id) {
        const anyVariantChecked = p.variants.some((v) => v.checked === true);
        if (anyVariantChecked) {
          return {
            ...p,
            checked: true,
          };
        } else {
          return {
            ...p,
            checked: false,
          };
        }
      } else {
        return p;
      }
    });
    setProductsList(updatedProductList);

    // add to the selected products
    const selectedProductsCopy = [...selectedProducts];

    // check if product is existing in selectedProducts
    const isProductExisting = selectedProductsCopy.find(
      (p) => p.id === product.id
    );
    let updatedSelectedProducts;
    if (isProductExisting) {
      // if the product exists,check if the variant exists
      const isVariantExisting = selectedProductsCopy
        .find((p) => p.id === product.id)
        .variants.find((v) => v.id === variant.id);
      if (isVariantExisting) {
        // if the variant existing ,delete from the variants
        updatedSelectedProducts = selectedProductsCopy.map((p) => {
          if (p.id === product.id) {
            return {
              ...p,
              variants: p.variants.filter((v) => v.id !== variant.id),
            };
          } else {
            return p;
          }
        });
      } else {
        //  if the variant does not exists,add to the variants
        updatedSelectedProducts = selectedProductsCopy.map((p) => {
          if (p.id === product.id) {
            return {
              ...p,
              variants: [...p.variants, variant],
            };
          } else {
            return p;
          }
        });
      }
    } else {
      // if the product doesnt exist, add product to the selectedproducts
      const updatedSelectedProductsCopy = [...selectedProductsCopy, product];

      // filter out remaining variants except the passed one
      updatedSelectedProducts = updatedSelectedProductsCopy.map((p) => {
        if (p.id === product.id) {
          return {
            ...p,
            variants: p.variants.filter((v) => v.id === variant.id),
          };
        } else {
          return p;
        }
      });
    }
    setSelectedProducts(updatedSelectedProducts);
  };

  const debounceSearch = (callback, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => callback.apply(this, args), delay);
    };
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setPageNumber(0);
    setProductsList([]);
    setSelectedProducts([]);
    !isLoading && fetchData(value, 0);
  };

  const debouncedSearch = debounceSearch(handleSearch, 500);

  const handleScroll = () => {
    const productPicker = document.getElementById("product_picker");
    const scrollTop = productPicker.scrollTop;
    const clientHeight = productPicker.clientHeight;
    const scrollHeight = productPicker.scrollHeight;

    if (scrollTop + clientHeight >= scrollHeight) {
      !isLoading && fetchData(searchText, pageNumber);
    }
  };

  return (
    <div className="w-[934px] h-[1027px] bg-[#00000033] absolute top-[75px] left-[253px] rounded flex justify-center items-center">
      <div className="w-[663px] h-[612px] bg-[#FFFFFF] rounded flex flex-col">
        <header className="flex justify-between items-center border border-[#0000001A] py-3 px-5">
          <div>Select Products</div>
          <button>
            <img
              src={close}
              alt="close"
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
              alt="search"
              width={17}
              height={17}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4"
            />
            <input
              placeholder="Search product"
              className="w-full pl-10 py-2 border border-gray-300 focus:outline-none font-normal text-sm"
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>
        </nav>
        <div
          className="flex-grow overflow-auto"
          id="product_picker"
          onScroll={handleScroll}
        >
          <ul>
            {productsList.map((product) => (
              <li key={product.id} className="border border-[#0000001A] pt-3 ">
                <div className="flex  items-center gap-2 ml-5">
                  <input
                    type="checkbox"
                    checked={product.checked || false}
                    className="accent-[#008060]"
                    onChange={() => updateProductChecked(product)}
                  />
                  <img
                    src={product.image.src}
                    width={36}
                    height={36}
                    alt={product.title}
                  />
                  <p>{product.title}</p>
                </div>

                {product.variants && (
                  <ul>
                    {product.variants.map((variant, index) => (
                      <li
                        key={variant.id}
                        className="border border-[#0000001A] py-3  "
                      >
                        <div className="flex justify-between ml-12 mr-5">
                          <div className="flex gap-2">
                            <input
                              type="checkbox"
                              className="accent-[#008060]"
                              checked={variant.checked || false}
                              onChange={() =>
                                updateVariantChecked(variant, product)
                              }
                            />
                            <p> {variant.title}</p>
                          </div>
                          <div className="flex gap-2">
                            <p>{variant.product_id} available</p>
                            <p>${variant.price}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          {isLoading && (
            <div className="flex justify-center items-center m-10">
              <div className="loader"></div>
            </div>
          )}
          {!isLoading && productsList.length === 0 && (
            <div className="flex justify-center items-center m-10">
              <p>No products found</p>
            </div>
          )}
        </div>
        <footer className="flex justify-between items-center py-3 px-5  sticky bottom-0 h-12 border border-[#0000001A]">
          <p>{selectedProducts.length} product selected</p>
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
