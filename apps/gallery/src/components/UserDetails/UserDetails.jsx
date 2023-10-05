"use client";
import { UploadTraitButton } from "@/components/UploadTraitButton";
import axios from "axios";
import userImage from "public/DefaultProfile.svg";
import { useEffect, useState } from "react";
import { BsSuitHeartFill, BsTwitter } from "react-icons/bs";
import { useAccount } from "wagmi";
import { LoadingNoggles } from "../LoadingNoggles/LoadingNoggles";
import UserAccountGallery from "../UserAccountGallery/UserAccountGallery";

const UserDetails = ({ searchAddress }) => {
  const [userData, setUserData] = useState({});
  const [userAddress, setUserAddress] = useState("");
  const [traitsData, setTraitsData] = useState(false);
  const [isErrorBanner, setIsErrorBanner] = useState(false);
  const [isLoading, setIsLoading] = useState({});

  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState("");
  const [twitter, setTwitter] = useState("");
  const [about, setAbout] = useState("");

  const [filter, setFilter] = useState("none");
  const [nfts, setNfts] = useState([]);
  const [likedNfts, setLikedNfts] = useState([]);
  const [headFilter, setHeadFilter] = useState(false);
  const [accessoryFilter, setAccessoryFilter] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const image = document.createElement("img");
      image.src = URL.createObjectURL(selectedFile);
      image.onload = () => {
        if (
          (image.width < 1025 && image.width > 399) ||
          (image.height < 1025 && image.height > 399)
        ) {
          setImageError(false);
          setFile(selectedFile);
          setImageUrl(URL.createObjectURL(selectedFile));
        } else {
          setImageError(true);
        }
      };
    }
  };

  const { address, isConnected } = useAccount();

  useEffect(() => {
    setIsLoading(true);
    axios
      .post(`/api/getUser?address=${searchAddress}`)
      .then((getUserApiRes) => {
        setUserData(getUserApiRes.data);
        setNfts(getUserApiRes.data.nfts);
        setLikedNfts(getUserApiRes.data.likedNfts);
        setUsername(getUserApiRes.data?.userName);
        setTwitter(getUserApiRes.data?.twitter);
        setAbout(getUserApiRes.data?.about);
        setIsLoading(false);
      })
      .catch((getUserApiError) => {});
    axios
      .post("/api/getTraits")
      .then((res) => {
        setTraitsData(res.data);
      })
      .catch((getTraitsApiError) => {});
  }, []);

  const handleModalToggle = () => {
    if (isConnected) {
      setIsModalOpen(!isModalOpen);
      // setIsOpensidebar(false);
    } else {
      setIsErrorBanner(true);
    }
  };

  useEffect(() => {
    setUserAddress(address);
  }, [address]);

  useEffect(() => {
    if (headFilter && filter != "likes") {
      const arr = userData?.nfts?.filter((nft) => {
        return nft.type == "heads";
      });
      const likedArr = userData?.likedNfts?.filter((nft) => {
        return nft.type == filter;
      });
      setNfts(arr);
      setLikedNfts(likedArr);
    } else if (accessoryFilter && filter != "likes") {
      const arr = userData?.nfts?.filter((nft) => {
        return nft.type == "accessories";
      });
      const likedArr = userData?.likedNfts?.filter((nft) => {
        return nft.type == filter;
      });
      setNfts(arr);
      setLikedNfts(likedArr);
    } else if (filter == "likes") {
      const arr = userData?.nfts;
      const likedArr = userData?.likedNfts;
      var sorted = arr?.sort((a, b) => b.likesCount - a.likesCount);
      var likedSorted = likedArr?.sort((a, b) => b.likesCount - a.likesCount);
      setNfts(sorted);
      setLikedNfts(likedSorted);
    } else {
      setNfts(userData?.nfts);
      setLikedNfts(userData?.likedNfts);
    }
  }, [headFilter, accessoryFilter, filter]);

  return (
    <>
      {/* <div className="container mx-auto flex flex-col py-10 text-white gap-5"> */}
      <div className="container  flex flex-col mx-auto gap-5 my-12 xl:px-10 lg:px-10 md:px-5 sm:px-4 xs:px-2 px-4">
        <div className=" flex w-full justify-between">
          <img
            src={userData?.profilePic ? userData?.profilePic : userImage.src}
            alt="Image"
            className="w-52 h-52 rounded-full border-2 dark:border-off-light border-off-dark object-cover select-none"
          />
        </div>
        <div className="w-full flex flex-col flex-wrap gap-4">
          <div className="flex flex-wrap justify-between ">
            <div className="flex">
              <h1 className="font-Pix text-xl text-black dark:text-white">
                {userData?.userName
                  ? userData?.userName
                  : userData?._id?.slice(0, 6) +
                    "..." +
                    userData?._id?.slice(38)}
              </h1>
            </div>
            <div className="flex flex-wrap gap-6 ">
              {searchAddress == userAddress ? (
                <>
                  <UploadTraitButton
                    className="bg-primary p-2 rounded-md text-white text-sm font-semibold border-1 border-[#1F1D28] dark:border-white  items-center gap-1  px-12 hidden 2xl:flex "
                    traitsData={traitsData}
                  />
                </>
              ) : null}
            </div>
          </div>
        </div>
        {userData?.twitter != "" ? (
          <div className="w-1/2 flex justify-between">
            <a
              href={`https://twitter.com/${userData?.twitter}`}
              target="_blank"
            >
              <div className="flex gap-2 text-md">
                <BsTwitter className="text-xl text-sky-500  hover:text-primary" />
                <p className="text-black dark:text-white text-md hover:text-primary">
                  @{userData?.twitter}
                </p>
              </div>
            </a>
          </div>
        ) : null}

        <div className="2xl:w-[570px]">
          <p className="text-lg text-black dark:text-white break-words">
            {userData?.about}
          </p>
        </div>
        <div className="flex flex-col py-8 gap-4">
          <h1 className="font-Pix text-xl text-black dark:text-white">
            My Traits
          </h1>
          <div className="flex w-3/4 gap-4 justify-start">
            <button
              onClick={() => setHeadFilter(!headFilter)}
              className={`bg-bright-light dark:bg-bright-dark ${
                headFilter ? "brightness-75" : ""
              } p-2 px-3 border-1 rounded-md border-[#1F1D28] dark:border-white text-black dark:text-white text-sm flex items-center gap-1`}
            >
              {`${userData?.headCount} Heads`}
            </button>
            <button
              onClick={() => setAccessoryFilter(!accessoryFilter)}
              className={`bg-bright-light dark:bg-bright-dark ${
                accessoryFilter ? "brightness-75" : ""
              } p-2 px-3 border-1 border-[#1F1D28] dark:border-white rounded-md text-black dark:text-white text-sm flex items-center gap-1`}
            >
              {`${userData?.accessoryCount} Accesories`}
            </button>
            <button
              // onClick={() => setFilter("likes")}
              onClick={() => setFilter(filter === "likes" ? null : "heads")}
              className={`bg-bright-light dark:bg-bright-dark p-2 px-3 border-1 border-[#1F1D28] dark:border-white rounded-md text-black dark:text-white text-sm flex items-center gap-1`}
            >
              {" "}
              <p>Total</p>
              <BsSuitHeartFill color="#FF2165" />
              {userData?.likesCount}
            </button>
            <button
              className={`bg-bright-light dark:bg-bright-dark  p-2 px-3 border-1 border-[#1F1D28] dark:border-white rounded-md text-black dark:text-white text-sm flex items-center gap-1`}
            >
              {" "}
              {userData && userData.likedNfts && userData.likedNfts.length}
              <p>Favorites</p>
            </button>
          </div>
          <UserAccountGallery userFavouriteData={nfts} />
        </div>
        <div className="flex flex-col gap-4 py-8">
          <h1 className="font-Pix text-xl text-black dark:text-white">
            My Favorites
          </h1>
          <UserAccountGallery userFavouriteData={likedNfts} />
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

export default UserDetails;
