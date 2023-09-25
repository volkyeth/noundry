"use client";
import axios from "axios";
import { useTheme } from "next-themes";
import userImage from "public/DefaultProfile.svg";
import { useContext, useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsSuitHeartFill, BsTwitter } from "react-icons/bs";
import { useAccount } from "wagmi";
import { LoadingNoggles } from "../LoadingNoggles/LoadingNoggles";
import ModalComp from "../Modal/ModalComp";
import UserAccountGallery from "../UserAccountGallery/UserAccountGallery";
import { MainContext } from "../../pages/_app";

const UserDetails = ({ searchAddress }) => {
  const [userData, setUserData] = useState({});
  const [userAddress, setUserAddress] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [traitData, setTraitData] = useState(false);
  const [isErrorBanner, setIsErrorBanner] = useState(false);
  const [isOpensidebar, setIsOpensidebar] = useState(false);
  const [isLoading, setIsLoading] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState("");
  const [twitter, setTwitter] = useState("");
  const [about, setAbout] = useState("");

  const [filter, setFilter] = useState("none");
  const [nfts, setNfts] = useState([]);
  const [likedNfts, setLikedNfts] = useState([]);
  const { theme, setTheme } = useTheme();
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

  const handleNameChange = (e) => {
    const { value } = e.target;
    setUsername(value.slice(0, 18));
    // setUserData({ ...userData, userName: value.slice(0, 18) });
  };
  const handleTwitterChange = (e) => {
    const { value } = e.target;
    setTwitter(value);
    // setUserData({ ...userData, twitter: value });
  };
  const handleAboutChange = (e) => {
    const { value } = e.target;
    setAbout(value.slice(0, 240));
    // setUserData({ ...userData, about: value.slice(0, 240) });
  };

  const handleSubmit = async () => {
    if (imageError == false) {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", username);
      formData.append("twitter", twitter);
      formData.append("about", about);
      formData.append("userAddress", address);

      const editProfileApiRes = await axios.post("/api/editProfile", formData);
      setIsEditModalOpen(false);
      setIsSaving(false);
      setTrigger(trigger + 2);
    }
  };

  const { address, isConnected } = useAccount();
  const { trigger, setTrigger } = useContext(MainContext);
  // useEffect(() => {
  //   setIsLoading(true);
  //   if (isConnected) {
  //     axios
  //       .post(`/api/getUser?address=${searchAddress}`)
  //       .then((getUserApiRes) => {
  //         setUserData(getUserApiRes.data);
  //         setNfts(getUserApiRes.data.nfts);
  //         setLikedNfts(getUserApiRes.data.likedNfts);
  //         setIsLoading(false);
  //       });
  //   }
  // }, []);
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
        setTraitData(res.data);
      })
      .catch((getTraitsApiError) => {});
  }, [trigger]);

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
                  <button
                    className="bg-primary p-2 rounded-md text-white text-sm font-semibold border-1 border-[#1F1D28] dark:border-white  items-center gap-1  px-12 hidden 2xl:flex "
                    onClick={handleModalToggle}
                  >
                    Upload Trait
                  </button>
                  <button
                    className="bg-bright-light dark:bg-bright-dark p-2 rounded-md text-black dark:text-white border-1 border-[#1F1D28] dark:border-white text-sm font-medium flex items-center gap-1 px-5 xl:mr-5 lg:mr-10 md:mr-0"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    Edit Profile
                  </button>
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

      {isEditModalOpen ? (
        <div className="z-10 bg-transparent fixed overflow-scroll top-0 w-full h-full flex justify-center  bg-white dark:bg-black bg-opacity-50 dark:bg-opacity-50">
          <div className=" rounded-2xl bg-white dark:bg-[#3C4049] container border-[#4A5568] border-2 my-auto flex flex-col gap-5 p-4">
            <div className="flex justify-between">
              <img
                src={
                  file
                    ? imageUrl
                    : userData.profilePic
                    ? userData.profilePic
                    : userImage.src
                }
                className="h-52 w-52 rounded-full object-cover"
              />
              <div
                className="h-fit w-fit p-2 border-2 border-gray-300 rounded-xl cursor-pointer"
                onClick={() => setIsEditModalOpen(false)}
              >
                <AiOutlineClose className="text-3xl stroke-white dark:stroke-black" />
              </div>
            </div>
            <div
              className={`relative dark:bg-[#434B58] flex text-xl overflow-hidden m-0  pr-2 text-black w-full  flex-auto rounded-t-lg rounded-b-lg border-gray-300 dark:border-[#4D5566] border-2`}
            >
              <p
                className={`dmd:text-sm text-black dark:text-white border-r-2 border-gray-300 dark:border-[#4D5566] w-1/4 dmd:w-1/2 bg-[#EBEBEB] dark:bg-[#16191E]  px-4 flex items-center`}
              >
                Choose File
              </p>
              <label
                className={`dmd:text-sm py-2 px-4 dmd:w-1/2 dmd:line-clamp-1 dmd:text-ellipsis  ${
                  imageError
                    ? "text-red-500"
                    : !file
                    ? "text-gray-400"
                    : "text-black dark:text-white"
                }`}
              >
                {!file || imageError
                  ? "Minimum 400px and maximum 1024px images are allowed."
                  : file?.name}
              </label>
              <input
                className={`opacity-0  absolute top-0 w-full h-full`}
                type="file"
                id="formFile"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>
            <div className="flex w-full text-black dark:text-white rounded-lg border-2 border-gray-300 dark:border-[#4D5566]">
              <div className="dmd:text-sm px-4 py-2 min-w-fit w-1/4 dmd:w-1/2 text-xl bg-[#EBEBEB] dark:bg-[#16191E]  rounded-l-lg border-r-2 border-gray-300 dark:border-[#4D5566]">
                {" "}
                Username
              </div>
              <input
                className="dmd:text-sm px-4 py-2 text-xl w-3/4 dmd:w-1/2 rounded-r-lg  bg-gray-50 dark:bg-[#434B58] text-[#1F1D28] dark:text-white"
                type="text"
                onChange={handleNameChange}
                value={username}
                name="userName"
              />
            </div>
            <div className="w-full">
              <div className="flex w-full text-black dark:text-white rounded-lg border-2 border-gray-300 dark:border-[#4D5566]">
                <div className="dmd:text-sm px-4 py-2 min-w-fit w-1/4 dmd:w-1/2 text-xl bg-[#EBEBEB] dark:bg-[#16191E] rounded-l-lg border-r-2 border-gray-300 dark:border-[#4D5566]">
                  {" "}
                  Twitter handler
                </div>
                <input
                  className="dmd:text-sm px-4 py-2 text-xl w-3/4 dmd:w-1/2 rounded-r-lg border-0 bg-gray-50 dark:bg-[#434B58] text-[#1F1D28] dark:text-white"
                  type="text"
                  value={twitter}
                  onChange={handleTwitterChange}
                  name="twitter"
                />
              </div>
              <div className="flex w-full text-gray-500 dark:text-gray-300 italic">
                <div className="w-1/4 dmd:w-1/2"></div>
                <div className="w-3/4 dmd:w-1/2 dmd:text-sm">
                  <a
                    href={`https://twitter.com/${userData?.twitter}`}
                    target="_blank"
                  >
                    https://twitter.com/{twitter}
                  </a>
                </div>
              </div>
            </div>
            <div className="w-full text-black dark:text-white">
              <p className="w-full px-4 py-2 dmd:text-sm text-xl">About</p>
              <textarea
                className=" dmd:text-sm w-full px-4 py-2 border-2 bg-gray-50 dark:bg-[#434B58] border-gray-300 dark:border-[#4D5566] rounded-lg"
                rows={3}
                value={about}
                placeholder="240 characters max"
                onChange={handleAboutChange}
                name="description"
              />
            </div>
            <div className="w-full min-h-11 flex justify-end ">
              {isSaving ? (
                <div className="w-full flex justify-end">
                  <LoadingNoggles className="!mx-0" />
                </div>
              ) : (
                <button
                  className="rounded-lg bg-black p-2 w-1/4 text-xl text-white"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
      {isLoading ? (
        <div className="bg-[#F5F5F5] dark:bg-[#24272F] fixed top-0 w-full h-full flex justify-center items-center">
          <LoadingNoggles />
        </div>
      ) : null}
      {isModalOpen}
      {isModalOpen ? (
        <ModalComp traitsData={traitData} setIsModalOpen={setIsModalOpen} />
      ) : null}
    </>
  );
};

export default UserDetails;
