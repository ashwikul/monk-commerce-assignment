import React, { useEffect, useRef, useState } from "react";
import close from "../assets/close.svg";
import search from "../assets/search.svg";
import image from "../assets/image.png";

function ProductPicker({
  index,
  setProductPicker,
  selectedProducts,
  setSelectedProducts,
  addProduct,
}) {
  const apiKey = process.env.REACT_APP_API_KEY;
  const [productsList, setProductsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [hasMoreData, setHasMoreData] = useState(true);
  const searchRef = useRef(null);

  useEffect(() => {
    fetchData(null, 0);
    searchRef.current.focus(); // Set focus to the search input
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

      // Handle no data found case for the initial page
      if (!data && pageNumber === 0) {
        setProductsList([]);
        setIsLoading(false);
        setHasMoreData(false);
        return;
      }

      // If no more data is available for further pages
      if (!data && pageNumber !== 0) {
        setHasMoreData(false);
        setIsLoading(false);
        return;
      }
      setHasMoreData(true);
      setPageNumber((prev) => prev + 1);
      setProductsList((prev) => [...prev, ...data]);
    } catch (error) {
      console.log("Error while fetching products", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProductChecked = (product) => {
    // Toggle the 'checked' status of a product and its variants
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

    // Add or remove product from selectedProducts list
    const selectedProductsCopy = [...selectedProducts];
    const isProductExisting = selectedProductsCopy.some(
      (p) => p.id === product.id
    );

    // If product is already selected, remove it from selectedProducts
    if (isProductExisting) {
      const updatedSelectedProducts = selectedProductsCopy.filter(
        (p) => p.id !== product.id
      );
      setSelectedProducts(updatedSelectedProducts);
    } else {
      // Otherwise, add it to selectedProducts
      setSelectedProducts((prev) => [...prev, product]);
    }
  };

  const updateVariantChecked = (variant, product) => {
    // Update the checked status of a variant within a product
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

    // Update the parent product checkbox based on its variants
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

    // Update the selectedProducts list based on variant selection
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

  // Debounce function to delay search requests
  const debounceSearch = (callback, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => callback.apply(this, args), delay);
    };
  };

  // Handle search input change
  const handleSearch = (value) => {
    setSearchText(value);
    setPageNumber(0);
    setProductsList([]);
    setSelectedProducts([]);
    !isLoading && fetchData(value, 0);
  };

  // Create a debounced version of the search handler
  const debouncedSearch = debounceSearch(handleSearch, 500);

  // Handle infinite scroll event
  const handleScroll = () => {
    const productPicker = document.getElementById("product_picker");
    const scrollTop = productPicker.scrollTop;
    const clientHeight = productPicker.clientHeight;
    const scrollHeight = productPicker.scrollHeight;

    // Load more products if scrolled to the bottom
    if (scrollTop + clientHeight >= scrollHeight) {
      !isLoading && hasMoreData && fetchData(searchText, pageNumber);
    }
  };

  return (
    <div className=" p-0 md:p-24 bg-[#00000033]  absolute top-0 left-0 md:top-[75px] md:left-[253px] rounded flex justify-center items-center">
      <div className="w-screen md:w-[663px] h-full md:h-[612px] bg-[#FFFFFF] rounded flex flex-col">
        <header className="flex justify-between items-center border border-[#0000001A] py-3 px-5 font-medium text-lg text-[#000000E5]">
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
          <div className="flex relative w-full h-8 ">
            <img
              src={search}
              alt="search"
              width={17}
              height={17}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4"
            />
            <input
              placeholder="Search product"
              className="w-full pl-10 py-2 border border-gray-300 font-normal text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              onChange={(e) => debouncedSearch(e.target.value)}
              ref={searchRef}
            />
          </div>
        </nav>
        <div
          className="flex-grow overflow-auto h-screen"
          id="product_picker"
          onScroll={handleScroll}
        >
          <ul className="font-normal text-base text-[#000000E5]">
            {productsList.map((product) => (
              <li
                key={product.id}
                className="border border-[#0000001A] cursor-pointer"
              >
                <div
                  className="flex items-center gap-2 ml-5 py-3 "
                  onClick={() => updateProductChecked(product)}
                >
                  <input
                    type="checkbox"
                    checked={product.checked || false}
                    className="accent-[#008060] w-6 h-6"
                    readOnly
                  />
                  {product.image.src ? (
                    <img
                      src={product.image.src || image}
                      width={36}
                      height={36}
                      alt={product.title}
                    />
                  ) : (
                    <div className="w-[38px] h-[38px] border border-[#0000001A] flex justify-center items-center rounded">
                      {" "}
                      <img src={image} alt={product.title} />
                    </div>
                  )}

                  <p>{product.title}</p>
                </div>

                {product.variants && (
                  <ul>
                    {product.variants.map((variant, index) => (
                      <li
                        key={variant.id}
                        className="border border-[#0000001A] py-3 px-3 cursor-pointer"
                        onClick={() => updateVariantChecked(variant, product)}
                      >
                        <div className="flex justify-between ml-12 mr-5">
                          <div className="flex gap-2">
                            <input
                              type="checkbox"
                              className=" accent-[#008060] w-6 h-6"
                              checked={variant.checked || false}
                              readOnly
                            />
                            <p> {variant.title}</p>
                          </div>
                          <div className="flex gap-8">
                            <p>{variant.inventory_quantity || 0} available</p>
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
        <footer className="flex justify-between items-center py-3 px-5  sticky bottom-0 h-12 border border-[#0000001A] bg-white">
          <p className="text-base text-[000000E5]">
            {selectedProducts.length} product selected
          </p>
          <div className="flex gap-2 text-sm font-semibold">
            <button
              className="border border-[#00000066] text-[#00000066] h-[34px] w-[106px] rounded cursor-pointer"
              onClick={() => setProductPicker(false)}
            >
              Cancel
            </button>
            <button
              className="border-2 border-[#008060] bg-[#008060] text-white h-9 w-[76px] rounded cursor-pointer"
              onClick={() => {
                addProduct(index);
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
