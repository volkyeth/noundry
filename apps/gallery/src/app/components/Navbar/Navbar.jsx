import { useWeb3Modal } from "@web3modal/react";
import jwt from "jsonwebtoken";
import axios from "axios";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logoImage from "public/EraserLogo.svg";
import profilePreview from "public/DefaultProfile.svg";
import { useEffect, useRef, useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { BiCaretDown } from "react-icons/bi";
import { useAccount, useDisconnect, useNetwork, useSignMessage } from "wagmi";
import { BsSquareHalf } from "react-icons/bs";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isErrorBanner, setIsErrorBanner] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isOpensidebarDropdown, setIsOpensidebarDropdown] = useState(false);
  const [isCaretRotated, setIsCaretRotated] = useState(false);
  const [isAccountConnected, setIsAccountConnected] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [traitsData, setTraitsData] = useState({
    backgrounds: [],
    bodies: [],
    accessories: [],
    heads: [],
    glasses: [],
  });
  const [profileImage, setProfileImage] = useState("");

  const { open, close } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const [show, setShowModal] = useState(false);

  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message: "Welcome To Noundry Gallery.",
  });

  const handleModalToggle = () => {
    if (isConnected) {
      setIsModalOpen(!isModalOpen);
      setIsOpensidebar(false);
    } else {
      setIsErrorBanner(true);
    }
  };

  const handleCommunity = () => {
    // navigation.navigate('/Community');
    window.location.href = "/Community";
    setIsOpensidebar(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsOpensidebar(false);
  };

  const handleSidebarDropdown = () => {
    setIsOpensidebarDropdown(!isOpensidebarDropdown);
    setIsCaretRotated(!isCaretRotated);
  };

  const sidebarRef = useRef(null);
  const handleDocumentClicksidebar = (event) => {
    // if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
    //   setIsOpensidebar(false);
    // setIsOpensidebarDropdown(false);
    // }
  };
  useEffect(() => {
    axios.post(`/api/getTraits`).then((res) => {
      setTraitsData(res.data);
    });
  }, []);

  let isChecked = localStorage.getItem("token");
  useEffect(() => {
    setIsAccountConnected(isConnected);
    if (isConnected && !isChecked) {
      setTimeout(() => {
        setShowModal(true);
      }, 1500);
    }
    axios.post(`/api/getProfileImage?address=${address}`).then((res) => {
      setProfileImage(res.data.profilePic);
    });
  }, [isConnected]);

  useEffect(() => {
    if (data) {
      axios.post(`/api/getVerify?address=${address}`).then((res) => {
        localStorage.setItem("token", res.data.token);
        setShowModal(false);
      });
    }
  }, [data]);

  return (
    <>
      <div className="bg-white dark:bg-bright-dark py-2 flex items-center">
        <div className="container mx-auto flex justify-between items-center xl:px-10 lg:px-10 md:px-5 sm:px-2 px-4">
          <Link href="/">
            <div className="flex items-center gap-4">
              <Image src={logoImage} alt="Image" className="h-16 w-16" />
              <div>
                <h1 className="text-[16px] 2xl:text-lg xl:text-lg lg:text-lg md:text-lg font-Pix text-black dark:text-white">
                  Noundry Gallery
                </h1>
              </div>
            </div>
          </Link>

          <div className="flex w-1/2 gap-4 2xl:justify-between dsm:justify-end md:justify-end lg:justify-end dxl:justify-end items-center">
            <div>
              <BsSquareHalf
                className="text-sm fill-dark dark:fill-light cursor-pointer"
                onClick={() => {
                  setTheme(theme == "dark" ? "light" : "dark");
                }}
              />
            </div>
            <div className="gap-6 w-1/4 hidden md:hidden lg:hidden xl:hidden 2xl:!flex">
              <div className="relative w-full flex justify-center bg-light dark:bg-dark rounded-md items-center align-middle p-2 px-8 border-1 border-[#4A5568] text-base font-bold">
                <button
                  className="flex gap-1 align-middle items-center text-black dark:text-white"
                  onClick={toggleDropdown}
                >
                  WTF? <BiCaretDown />
                </button>
                {isOpen && (
                  <ClickAwayListener onClickAway={toggleDropdown}>
                    <div className="flex flex-col w-full gap-2 absolute z-20 left-0 top-12">
                      <a
                        href="/about"
                        className="flex justify-center border-1 p-2 rounded-md bg-light dark:bg-dark dark:hover:bg-off-dark hover:bg-bright-light text-dark dark:text-light border-bright-dark"
                      >
                        <button onClick={toggleDropdown} className="">
                          About
                        </button>
                      </a>
                      <a
                        href="/guidelines"
                        className="flex justify-center border-1 p-2 rounded-md bg-light dark:bg-dark dark:hover:bg-off-dark hover:bg-bright-light text-dark dark:text-light border-bright-dark"
                      >
                        <button onClick={toggleDropdown} className="">
                          Guidelines
                        </button>
                      </a>
                      <a
                        href="/DAOSubmit"
                        className="flex justify-center border-1 p-2 rounded-md bg-light dark:bg-dark dark:hover:bg-off-dark hover:bg-bright-light text-dark dark:text-light border-bright-dark"
                      >
                        <button onClick={toggleDropdown} className="">
                          Submit to DAO{" "}
                        </button>
                      </a>

                      <a
                        href="/commission"
                        className="flex justify-center border-1 p-2 rounded-md bg-light dark:bg-dark dark:hover:bg-off-dark hover:bg-bright-light text-dark dark:text-light border-bright-dark"
                      >
                        <button onClick={toggleDropdown} className="">
                          Commission{" "}
                        </button>
                      </a>
                    </div>
                  </ClickAwayListener>
                )}
              </div>
            </div>
            <a
              href="/Community"
              className="w-1/4 relative hidden md:hidden lg:hidden xl:hidden 2xl:!flex "
            >
              <div className="relative w-full flex justify-center bg-light dark:bg-dark rounded-md items-center align-middle p-2 px-8 border-1 border-[#4A5568] text-base font-bold">
                <button className="flex gap-1 align-middle items-center text-black dark:text-white">
                  Community
                </button>
              </div>
            </a>
            <div className="hidden w-1/2 lg:w-1/2 md:w-1/2 relative 2xl:flex ">
              <div className="flex gap-2 w-full">
                {isAccountConnected ? (
                  <img
                    className="!h-11 !w-11 object-fill aspect-square border-1 border-black dark:border-white rounded-full cursor-pointer"
                    onClick={() => {
                      setIsProfileModalOpen(false);
                      router.push(`/profile/${address}`);
                    }}
                    src={
                      profileImage == undefined || profileImage == ""
                        ? profilePreview.src
                        : profileImage
                    }
                  ></img>
                ) : null}
                <button
                  className="relative justify-center border-1 flex items-center bg-off-dark  w-full border-off-light dark:border-white rounded-md text-white p-2 px-5 text-base font-bold"
                  onClick={() =>
                    !isConnected
                      ? open()
                      : setIsProfileModalOpen(!isProfileModalOpen)
                  }
                >
                  {!isAccountConnected
                    ? "Connect"
                    : `${address?.slice(0, 5)}...${address?.slice(38)}`}
                  {isProfileModalOpen ? (
                    <ClickAwayListener
                      onClickAway={() => setIsProfileModalOpen(false)}
                    >
                      <div
                        className={`absolute z-10 top-14 left-0 border border-[#27282D] rounded-md overflow-hidden w-full flex flex-col`}
                      >
                        <button
                          onClick={() => {
                            setIsProfileModalOpen(false);
                            disconnect();
                          }}
                          className="p-2 bg-primary w-full text-white"
                        >
                          Disconnect
                        </button>
                      </div>
                    </ClickAwayListener>
                  ) : null}
                  {!isAccountConnected ? null : <BiCaretDown fontSize={20} />}
                </button>

                {/* <button disabled={isLoading} onClick={() => signMessage()}>
                  Sign message
                </button>
                {isSuccess && <div>Signature: {data}</div>}
                {isError && <div>Error signing message</div>} */}
              </div>
            </div>
            <div className="flex 2xl:hidden" onClick={toggleSidebar}>
              <AiOutlineMenu fontSize={25} />
            </div>
          </div>
        </div>
        {isSidebarOpen ? (
          <div className="fixed top-0 right-0 h-full w-3/4 flex flex-col gap-4 bg-off-light dark:bg-off-dark z-40 p-6">
            <div
              className=" w-fit rounded-md p-2 border-2 border-black dark:border-white text-black dark:text-white"
              onClick={() => setIsSidebarOpen(false)}
            >
              <AiOutlineClose className="text-2xl " />
            </div>

            {/*Connect Mobile Menu*/}
            <div className="flex flex-col gap-2 w-full">
              <button
                className="bg-[#000] w-full border-1 border-black dark:border-white  rounded-md text-white p-2 px-5 text-base font-bold"
                onClick={() =>
                  !isConnected
                    ? open()
                    : setIsProfileModalOpen(!isProfileModalOpen)
                }
              >
                {!isAccountConnected
                  ? "Connect"
                  : `${address?.slice(0, 5)}...${address?.slice(38)}`}
              </button>
              {isConnected ? (
                <>
                  {/*<a href={`/profile/${address}`}>
                    <button
                      onClick={() => {
                        setIsProfileModalOpen(false);
                      }}
                      className="bg-dark w-full border-2 border-black rounded-md text-white p-2 px-5 text-base font-bold"
                    >
                      Profile
                    </button>
                  </a>*/}
                  <button
                    onClick={() => {
                      setIsProfileModalOpen(false);
                      disconnect();
                    }}
                    className="bg-primary w-full border-2 border-black dark:border-white rounded-md text-white p-2 px-5 text-base font-bold"
                  >
                    Disconnect
                  </button>
                </>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <a href={`/Community`}>
                <button className="bg-white text-black dark:bg-off-dark w-full border-1 border-black dark:border-white rounded-md dark:text-white p-2 px-5 text-base font-bold">
                  Community
                </button>
              </a>

              <a href={`/about`}>
                <button className="bg-white text-black dark:bg-off-dark w-full border-1 border-black dark:border-white rounded-md dark:text-white p-2 px-5 text-base font-bold">
                  About
                </button>
              </a>

              <a href={`/guidelines`}>
                <button className="bg-white text-black dark:bg-off-dark w-full border-1 border-black dark:border-white rounded-md dark:text-white p-2 px-5 text-base font-bold">
                  Guidelines
                </button>
              </a>

              <a href={`/DAOSubmit`}>
                <button className="bg-white text-black dark:bg-off-dark w-full border-1 border-black dark:border-white rounded-md dark:text-white p-2 px-5 text-base font-bold">
                  DAO Submit
                </button>
              </a>

              <a href={`/commission`}>
                <button className="bg-white text-black dark:bg-off-dark w-full border-1 border-black dark:border-white rounded-md dark:text-white p-2 px-5 text-base font-bold">
                  Commission
                </button>
              </a>
            </div>
          </div>
        ) : null}
      </div>

      {/* modal here.... */}

      {show && (
        <div
          className={`fixed top-0 left-0 flex bg-white dark:bg-black bg-opacity-50 dark:bg-opacity-50 justify-center z-[1] h-full w-full overflow-y-scroll overflow-x-hidden `}
          id="exampleModalLg"
          aria-labelledby="exampleModalLgLabel"
          aria-modal="true"
          role="dialog"
        >
          <div className=" my-auto flex gap-4 font-Pix container h-fit p-8 py-20 text-center font-bold flex-col rounded-lg border-1 border-[#4A5568] bg-white text-black bg-clip-padding text-current shadow-lg dark:bg-off-dark">
            <p className="font-Pix text-xl">WelCome To Noundry Gallery</p>
            <div className="w-full mt-10 flex text-center justify-evenly">
              <button
                className="bg-white text-black dark:bg-off-dark w-1/3 border-1 border-black dark:border-white rounded-md dark:text-white p-2 px-5 text-base font-bold"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="bg-white text-black dark:bg-off-dark w-1/3 border-1 border-black dark:border-white rounded-md dark:text-white p-2 px-5 text-base font-bold"
                disabled={isLoading}
                onClick={() => signMessage()}
              >
                Accept and Sign
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
