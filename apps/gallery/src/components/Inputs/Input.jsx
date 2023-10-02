"use client";
import { useEffect, useRef, useState } from "react";
import { BiCaretDown } from "react-icons/bi";
import { HiSortAscending, HiSortDescending } from "react-icons/hi";
import { LiaSearchSolid } from "react-icons/lia";
import { UploadTraitButton } from "../UploadTraitButton";

const Input = ({
  setDisplayNfts,
  nfts,
  traitsData,
  setThemeState1,
  setTypes2,
  SearchQuery,
  SetSearchQuery,
  setOrder,
  order,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterArray, setFilterArray] = useState([]);
  const [isReverse, setIsReverse] = useState(false);
  const [sort, setSort] = useState("creation date");
  const [search, setSearch] = useState("");
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const dropdownRef = useRef(null);

  const handleDocumentClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    const arrWithTypeFilter = nfts.filter((nft) => {
      return filterArray.length > 0 ? filterArray.includes(nft.type) : true;
    });

    const filterArr = arrWithTypeFilter.filter(
      (obj) =>
        obj?.name?.toLowerCase().startsWith(search.toLowerCase()) ||
        obj?.type?.toLowerCase().startsWith(search.toLowerCase()) ||
        obj?.twitter?.toLowerCase().startsWith(search.toLowerCase()) ||
        obj?.background?.toLowerCase().startsWith(search.toLowerCase()) ||
        obj?.body?.toLowerCase().startsWith(search.toLowerCase()) ||
        obj?.head?.toLowerCase().startsWith(search.toLowerCase()) ||
        obj?.accessory?.toLowerCase().startsWith(search.toLowerCase()) ||
        obj?.glasses?.toLowerCase().startsWith(search.toLowerCase())
    );

    // if (filterArray.length > 0) {
    switch (sort) {
      case "creation date":
        var sorted = filterArr.sort((a, b) => b.creationDate - a.creationDate);

        if (isReverse) {
          setDisplayNfts(sorted.reverse());
        } else {
          setDisplayNfts(sorted);
        }
        break;
      case "name":
        var sorted = filterArr.sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
          }
          if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
          }
          return 0;
        });

        if (isReverse) {
          setDisplayNfts(sorted.reverse());
        } else {
          setDisplayNfts(sorted);
        }
        break;
      case "likes":
        var sorted = filterArr.sort((a, b) => b.likesCount - a.likesCount);

        if (isReverse) {
          setDisplayNfts(sorted.reverse());
        } else {
          setDisplayNfts(sorted);
        }
        break;
      case "artist":
        var sorted = filterArr.sort((a, b) => {
          if (a.twitter.toLowerCase() < b.twitter.toLowerCase()) {
            return -1;
          }
          if (a.twitter.toLowerCase() > b.twitter.toLowerCase()) {
            return 1;
          }
          return 0;
        });
        if (isReverse) {
          setDisplayNfts(sorted.reverse());
        } else {
          setDisplayNfts(sorted);
        }
        break;
    }
  }, [filterArray, sort, isReverse, search]);

  return (
    <div className="grid grid-cols-2 gap-4 mt-6 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-2 2xl:grid-cols-4 sm:grid-cols-1 sm:px-4">
      <UploadTraitButton
        className="relative w-full flex shadow-md justify-center items-center min-h-[2.8rem] bg-primary text-white rounded-md border-1 border-black  dark:border-white font-bold tracking-wider"
        traitsData={traitsData}
      />
      <div className="flex text-black w-full">
        <div
          className="cursor-pointer justify-center w-2/5 bg-white dark:bg-dark md:flex md:justify-center text-black dark:text-white flex items-center py-3 gap-1 border-1 border-[#4A5568] rounded-l-md font-normal text-sm dmd:text-xs"
          onClick={() => setOrder(!order)}
        >
          {order ? (
            <HiSortAscending fontSize={20} />
          ) : (
            <HiSortDescending fontSize={20} />
          )}
          <p>Sort by</p>
        </div>
        <div className="relative flex w-3/5 md:flex md:justify-center">
          <button
            className="w-full justify-center bg-white dark:bg-dark md:gap-3 md:flex md:justify-center text-black dark:text-white py-3 gap-1 md:w-full flex items-center  border-1 border-[#4A5568] border-l-0 rounded-r-md font-normal text-sm dmd:text-xs"
            onClick={toggleDropdown}
            ref={dropdownRef}
          >
            {sort?.charAt(0).toUpperCase() + sort.slice(1)}{" "}
            <BiCaretDown fontSize={20} />
          </button>
          {isOpen && (
            <div className="w-full absolute flex flex-col gap-1 xl:top-20 lg:top-[80px] sm:top-[60px] left-0 top-14 text-[14px] rounded-md z-[1]">
              {sort !== "creation date" ? (
                <button
                  onClick={() => {
                    setSort("creation date");
                  }}
                  className="w-full py-3 bg-light dark:bg-dark hover:bg-bright-light dark:hover:bg-bright-dark rounded-md border-1 border-off-light dark:border-off-dark text-black dark:text-white dmd:text-xs"
                >
                  Creation date
                </button>
              ) : (
                ""
              )}

              {sort !== "likes" ? (
                <button
                  onClick={() => {
                    setSort("likes");
                  }}
                  className="w-full py-3 bg-light dark:bg-dark hover:bg-bright-light dark:hover:bg-bright-dark rounded-md border-1 border-off-light dark:border-off-dark text-black dark:text-white dmd:text-xs"
                >
                  Likes
                </button>
              ) : (
                ""
              )}

              {sort !== "artist" ? (
                <button
                  onClick={() => {
                    setSort("artist");
                  }}
                  className="w-full py-3 bg-light dark:bg-dark hover:bg-bright-light dark:hover:bg-bright-dark rounded-md border-1 border-off-light dark:border-off-dark text-black dark:text-white dmd:text-xs"
                >
                  Artist
                </button>
              ) : (
                ""
              )}

              {sort !== "name" ? (
                <button
                  onClick={() => {
                    setSort("name");
                  }}
                  className="w-full py-3 bg-light dark:bg-dark hover:bg-bright-light dark:hover:bg-bright-dark rounded-md border-1 border-off-light dark:border-off-dark text-black dark:text-white dmd:text-xs"
                >
                  Name
                </button>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
      </div>

      <div className="w-full flex-wrap md:flex gap-4 md:justify-around py-2 flex items-center bg-white dark:bg-dark px-3 border-1 border-[#4A5568] rounded-md text-black dark:text-white ">
        <div className="flex gap-2">
          <input
            type="checkbox"
            onChange={(e) => {
              if (e.target.checked) {
                setThemeState1({ type1: "heads" });
              } else {
                setThemeState1({ type1: "" });
              }
            }}
            value="test"
          />
          <span className="text-sm dmd:text-xs ">Heads</span>
        </div>
        <div className="flex gap-2">
          <input
            type="checkbox"
            onChange={(e) => {
              if (e.target.checked) {
                setTypes2({ type2: "accessories" });
              } else {
                setTypes2({ type2: "" });
              }
            }}
            value="test"
          />
          <span className="text-sm  dmd:text-xs ">Accessories</span>
        </div>
      </div>

      <div className="flex text-black w-full">
        <div className="relative w-full">
          <input
            type="search"
            id="search-dropdown"
            className="bg-white dark:bg-dark block p-2.5 w-full h-full z-20 text-sm text-gray-900 border-1 border-[#4A5568] rounded-md  dark:placeholder-gray-400 dark:text-white dmd:text-xs"
            placeholder="Search..."
            required
            value={SearchQuery}
            onChange={(e) => SetSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute top-0 right-0 py-2.5 px-6 bg-white  dark:bg-dark text-sm font-medium h-full text-white border-1 border-[#4A5568] rounded-r-md "
          >
            <LiaSearchSolid
              fontSize={20}
              className="text-[#000000] dark:text-[#FFFFFF]"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Input;
