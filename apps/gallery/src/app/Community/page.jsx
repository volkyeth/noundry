"use client";
import axios from "axios";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { BiCaretDown } from "react-icons/bi";
import { HiSortAscending, HiSortDescending } from "react-icons/hi";
import { LiaSearchSolid } from "react-icons/lia";
import { useAccount } from "wagmi";
import { AccountImage } from "../components/AccountImage/AccountImage";
import BannerModal from "../components/BannerModal/BannerModal";
import ErrorBanner from "../components/ErrorBanner/ErrorBanner";
import { LoadingNoggles } from "../components/LoadingNoggles/LoadingNoggles";
import ModalComp from "../components/Modal/ModalComp";

const Community = () => {
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [displayUsers, setDisplayUsers] = useState([]);
  const [sort, setSort] = useState("likes");
  const [isReverse, setIsReverse] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenBanner, setIsModalOpenBanner] = useState(false);
  const [isErrorBanner, setIsErrorBanner] = useState(false);
  const [traitsData, setTraitsData] = useState({
    backgrounds: [],
    bodies: [],
    accessories: [],
    heads: [],
    glasses: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const { isConnected } = useAccount();
  const { theme, setTheme } = useTheme();
  const dropdownRef = useRef(null);
  const handleModalToggle = () => {
    if (isConnected) {
      setIsModalOpen(!isModalOpen);
    } else {
      setIsErrorBanner(true);
    }
  };
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const loadMore = async () => {
    setIsLoadingMore(true);
    const getUsersApiRes = await axios.post(`/api/getUsers?page=${page}`);

    var sorted = getUsersApiRes.data.sort(
      (a, b) => b.likesCount - a.likesCount
    );

    setUsers([...users, ...sorted]);
    setDisplayUsers([...displayUsers, ...sorted]);
    setPage(page + 1);
    setIsLoadingMore(false);
  };

  const handleDocumentClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    let temp = users.filter(
      (user) =>
        user?.userName?.toLowerCase().startsWith(search.toLowerCase()) ||
        user?.twitter?.toLowerCase().startsWith(search.toLowerCase()) ||
        user?._id?.toLowerCase().startsWith(search.toLowerCase())
    );

    switch (sort) {
      case "sign up Date":
        var sorted = temp.sort((a, b) => b.signUpDate - a.signUpDate);
        if (isReverse) {
          setDisplayUsers(sorted.reverse());
        } else {
          setDisplayUsers(sorted);
        }
        // signUpDate
        break;
      case "name":
        var sorted = temp.sort((a, b) => {
          if (a.twitter < b.twitter) {
            return -1;
          }
          if (a.twitter > b.twitter) {
            return 1;
          }
          return 0;
        });
        if (isReverse) {
          setDisplayUsers(sorted.reverse());
        } else {
          setDisplayUsers(sorted);
        }
        break;
      case "likes":
        var sorted = temp.sort((a, b) => b.likesCount - a.likesCount);
        if (isReverse) {
          setDisplayUsers(sorted.reverse());
        } else {
          setDisplayUsers(sorted);
        }
        break;
    }
  }, [sort, search, isReverse]);
  const update = async () => {
    setIsLoading(true);
    await axios.post("/api/getTraits").then((res) => {
      setTraitsData(res.data);
    });
    await axios.post("/api/getUsers").then((getUsersApiRes) => {
      setUsers(getUsersApiRes.data);
      var sorted = getUsersApiRes.data.sort(
        (a, b) => b.likesCount - a.likesCount
      );
      setDisplayUsers(sorted);
    });
    setIsLoading(false);
  };
  useEffect(() => {
    update();
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);
  return (
    <>
      <div className="container mx-auto py-10 flex flex-col gap-6 xl:px-10 lg:px-10 md:px-5 sm:px-6 xs:px-2 px-8">
        <div className="w-full flex justify-between items-center">
          <h1 className="font-Pix text-4xl sm:text-lg dsm:text-lg md:text-lg lg:text-2xl">
            Community
          </h1>
        </div>
        <div className="flex flex-row dlg:flex-col  justify-between mt-5">
          <div className="flex gap-4 w-1/2 text-base dmd:text-sm dlg:w-full">
            <div className="flex text-black w-1/2">
              <div
                onClick={() => setIsReverse(!isReverse)}
                className="cursor-pointer justify-center w-2/5 bg-white dark:bg-dark md:flex md:justify-center text-black dark:text-white flex items-center py-3 gap-1 border-1 border-[#4A5568] rounded-l-md font-normal text-sm "
              >
                {isReverse ? (
                  <HiSortAscending fontSize={20} />
                ) : (
                  <HiSortDescending fontSize={20} />
                )}
                <p>Sort By</p>
              </div>
              <div className="relative flex w-3/5 md:flex md:justify-center">
                <button
                  className="w-full justify-center bg-white dark:bg-dark md:gap-3 md:flex md:justify-center text-black dark:text-white py-3 gap-1 md:w-full flex items-center  border-1 border-[#4A5568] border-l-0 rounded-r-md font-normal text-sm "
                  onClick={toggleDropdown}
                  ref={dropdownRef}
                >
                  {sort?.charAt(0).toUpperCase() + sort.slice(1)}{" "}
                  <BiCaretDown fontSize={20} />
                </button>
                {isOpen && (
                  <div className="w-full absolute flex flex-col gap-1 xl:top-20 lg:top-[80px] sm:top-[60px] left-0 top-14 text-[14px] rounded-md z-[1]">
                    <button
                      onClick={() => {
                        setSort("likes");
                      }}
                      className="w-full py-3 bg-light dark:bg-dark hover:bg-bright-light dark:hover:bg-bright-dark rounded-md border-1 border-off-light dark:border-off-dark text-black dark:text-white"
                    >
                      Total Likes
                    </button>

                    <button
                      onClick={() => {
                        setSort("name");
                      }}
                      className="w-full py-3 bg-light dark:bg-dark hover:bg-bright-light dark:hover:bg-bright-dark rounded-md border-1 border-off-light dark:border-off-dark text-black dark:text-white"
                    >
                      Name
                    </button>

                    <button
                      onClick={() => {
                        setSort("sign up Date");
                      }}
                      className="w-full py-3 bg-light dark:bg-dark hover:bg-bright-light dark:hover:bg-bright-dark rounded-md border-1 border-off-light dark:border-off-dark text-black dark:text-white"
                    >
                      Sign up Date
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex text-black md:w-fit">
              <div className="relative">
                <input
                  type="search"
                  id="search-dropdown"
                  className="bg-white dark:bg-dark block p-2.5 w-full h-full z-20 text-sm text-gray-900 border-1 border-[#4A5568] rounded-lg  dark:placeholder-gray-400 dark:text-white"
                  placeholder="Search.."
                  required
                  value={search.replace(" ", "-")}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute top-0 right-0 py-2.5 px-6 bg-white dark:bg-dark text-sm font-medium h-full text-white border-1 border-[#4A5568] rounded-r-lg "
                >
                  <LiaSearchSolid
                    fontSize={20}
                    className="text-[#000000] dark:text-[#FFFFFF]"
                  />
                </button>
              </div>
            </div>
          </div>
          <button
            className="bg-primary p-2 rounded-md text-base dmd:text-sm font-semibold items-center gap-1 border-1 border-[#1F1D28] dark:border-white text-white px-12 hidden 2xl:flex "
            onClick={handleModalToggle}
          >
            Upload Trait
          </button>
        </div>

        <div>
          <AccountImage users={displayUsers} />
        </div>
        <div>
          <button
            onClick={() => loadMore()}
            className="p-4 mt-4 relative max-h-12 w-full flex justify-center items-center bg-white dark:bg-off-dark text-black dark:text-white rounded-md border-1 border-black  dark:border-white font-bold tracking-wider"
          >
            {isLoadingMore ? (
              <LoadingNoggles className={"!h-full !my-0"} />
            ) : (
              "Load More"
            )}
          </button>
        </div>
        <div className="col-span-4 mt-28 ml-3 mr-3">
          {/* <button
            onClick={handleModalToggle}
            className="w-16 bg-[#FF443B] border-1 border-[#FFFFFF] rounded-md text-[#FFFFFF] p-3 text-base font-bold"
          >
            Submit Your Trait
          </button> */}
          {isModalOpen ? (
            <ModalComp
              setIsModalOpen={setIsModalOpen}
              setIsModalOpenBanner={setIsModalOpenBanner}
              traitsData={traitsData}
            />
          ) : null}
          {isModalOpenBanner ? (
            <BannerModal
              isModalOpenBanner={isModalOpenBanner}
              setIsModalOpenBanner={setIsModalOpenBanner}
            />
          ) : null}

          {isErrorBanner ? (
            <ErrorBanner
              isErrorBanner={isErrorBanner}
              setIsErrorBanner={setIsErrorBanner}
              message={"Please Connect wallet to continue"}
            />
          ) : null}
        </div>
      </div>
      {isLoading ? (
        <div className="bg-[#F5F5F5] dark:bg-[#24272F] fixed top-0 w-full h-full flex justify-center items-center">
          <LoadingNoggles />
        </div>
      ) : null}
    </>
  );
};

export default Community;
