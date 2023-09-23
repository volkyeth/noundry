"use client";

import axios from "axios";
import { useTheme } from "next-themes";
{
  /*import Image from "next/image";
import bannerImageDark from "public/pixel-heart-darkmode.svg";
import bannerImage from "public/pixel-heart.svg";*/
}
import { useContext, useEffect, useState } from "react";
import ErrorBanner from "./components/ErrorBanner/ErrorBanner";
import Gallery from "./components/Imagegallery/gallery";
import Input from "./components/Inputs/Input";
import ModalComp from "./components/Modal/ModalComp";
{
  /*import "./globals.css";*/
}
import { MainContext } from "./layout";
import { LoadingNoggles } from "./components/LoadingNoggles/LoadingNoggles";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [displayNfts, setDisplayNfts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isErrorBanner, setIsErrorBanner] = useState(false);
  const [themeState, setThemeState] = useState(false);

  const [traitsData, setTraitsData] = useState({
    backgrounds: [],
    bodies: [],
    accessories: [],
    heads: [],
    glasses: [],
  });

  const [types1, setTypes1] = useState({ type1: "" });
  const [types2, setTypes2] = useState({ type2: "" });
  const [searchQuery, SetSearchQuery] = useState("");
  const [order, setOrder] = useState(false);

  let { trigger } = useContext(MainContext);

  const { theme, setTheme } = useTheme();

  const loadMore = async () => {
    setIsLoadingMore(true);
    const getNFTApiRes = await axios.post(`/api/getNFTs?page=${page}`);

    var sorted = getNFTApiRes.data.sort(
      (a, b) => b.creationDate - a.creationDate
    );

    setNfts([...nfts, ...sorted]);
    setDisplayNfts([...displayNfts, ...sorted]);
    setPage(page + 1);
    setIsLoadingMore(false);
  };

  let orderType = order ? "desc" : "asc";
  const updateNFTs = async () => {
    const params = {};

    if (types1.type1) {
      params.type1 = types1.type1;
    }
    if (types2.type2) {
      params.type2 = types2.type2;
    }
    if (searchQuery) {
      params.search = searchQuery;
    }
    if (orderType) {
      params.orderBy = orderType;
    }

    const queryString = new URLSearchParams(params).toString();

    const url = `/api/getNFTs${queryString ? `?${queryString}` : ""}`;

    const getNFTApiRes = await axios.post(url);

    // var sorted = getNFTApiRes.data.sort(
    //   (a, b) => b.creationDate - a.creationDate
    // );

    setNfts(getNFTApiRes.data);
    setDisplayNfts(getNFTApiRes.data);
  };

  // const SortData = async () => {
  //   const params = {};
  //   params.orderBy = orderType;

  //   const queryString = new URLSearchParams(params).toString();

  //   const url = `/api/getNFTs${queryString ? `?${queryString}` : ""}`;

  //   const getNFTApiRes = await axios.post(url);
  //   setNfts(getNFTApiRes.data);
  //   setDisplayNfts(getNFTApiRes.data);
  // };

  useEffect(() => {
    axios.post("/api/getTraits").then((res) => {
      setTraitsData(res.data);
    });
    updateNFTs();
    // SortData();
  }, [types1, types2, searchQuery, order, trigger]);

  // useEffect(() => {
  //   updateNFTs();
  // }, [trigger]);

  useEffect(() => {
    localStorage.setItem("theme", theme == "dark" ? "dark" : "light");
    setThemeState(localStorage.getItem("theme"));
    setTheme(theme);
  }, [theme]);

  return (
    <>
      <div className="container mx-auto my-12 xl:px-10 lg:px-10 md:px-5 sm:px-2 xs:px-2 px-4">
        {/*<div className="flex items-center justify-center dsm:justify-between">
          <Image
            src={themeState == "dark" ? bannerImage : bannerImageDark}
            className="w-full dsm:w-5/6 h-auto select-none"
            alt="Image"
          />
        </div>*/}
        <Input
          setThemeState1={setTypes1}
          setTypes2={setTypes2}
          setDisplayNfts={setDisplayNfts}
          nfts={nfts}
          traitsData={traitsData}
          SetSearchQuery={SetSearchQuery}
          searchQuery={searchQuery}
          setOrder={setOrder}
          order={order}
        />
        {nfts.length > 0 ? (
          <Gallery imageCardData={displayNfts} />
        ) : (
          searchQuery && (
            <p className="font-Pix text-xl text-center mt-10">
              No matching Traits!
            </p>
          )
        )}

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
        <div className="col-span-4 mt-28 ml-3 mr-3">
          {isModalOpen ? (
            <ModalComp
              setIsModalOpen={setIsModalOpen}
              traitsData={traitsData}
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
    </>
  );
}
