import React, { useEffect, useState } from "react";
import close from "../assets/close.svg";
import search from "../assets/search.svg";

function ProductPicker({ setProductPicker }) {
  const apiKey = process.env.REACT_APP_API_KEY;
  const [productsList, setProductsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchData(null, 0);
  }, []);

  const fetchData = async (text, pageNumber) => {
    console.log("fetching data", text, pageNumber);

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
      console.log("data", data);
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
    console.log("product", product);
  };

  const updateVariantChecked = (variant, product) => {
    console.log("variant", variant);
    console.log("product", product);
  };

  console.log("productsList", productsList);

  const debounceSearch = (callback, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => callback.apply(this, args), delay);
    };
  };

  const handleSearch = (value) => {
    console.log("search text", value);
    setSearchText(value);
    setPageNumber(0);
    setProductsList([]);
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
          <p>0 product selected</p>
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
