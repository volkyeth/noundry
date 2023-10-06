import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import LogoImage from "public/EraserLogo.svg";
import { useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { BiCaretDown } from "react-icons/bi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOpensidebarDropdown, setIsOpensidebarDropdown] = useState(false);
  const [isCaretRotated, setIsCaretRotated] = useState(false);

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

  return (
    <>
      <div className="bg-white  py-2 flex items-center">
        <div className="container mx-auto flex justify-between items-center xl:px-10 lg:px-10 md:px-5 sm:px-2 px-4">
          <Link href="/">
            <div className="flex items-center gap-4">
              <LogoImage className="h-16 w-16" />
              <div>
                <h1 className="text-[16px] 2xl:text-lg xl:text-lg lg:text-lg md:text-lg font-Pix text-black">
                  Noundry Gallery
                </h1>
              </div>
            </div>
          </Link>

          <div className="flex w-1/2 gap-4 2xl:justify-between dsm:justify-end md:justify-end lg:justify-end dxl:justify-end items-center">
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
              href="/artists"
              className="w-1/4 relative hidden md:hidden lg:hidden xl:hidden 2xl:!flex "
            >
              <div className="relative w-full flex justify-center bg-light dark:bg-dark rounded-md items-center align-middle p-2 px-8 border-1 border-[#4A5568] text-base font-bold">
                <button className="flex gap-1 align-middle items-center text-black dark:text-white">
                  Artists
                </button>
              </div>
            </a>
            <div className="hidden w-1/2 lg:w-1/2 md:w-1/2 relative 2xl:flex ">
              <div className="flex gap-2 w-full">
                <ConnectKitButton />
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
              <ConnectKitButton />
            </div>

            <div className="flex flex-col gap-2">
              <a href={`/artists`}>
                <button className="bg-white text-black dark:bg-off-dark w-full border-1 border-black dark:border-white rounded-md dark:text-white p-2 px-5 text-base font-bold">
                  Artists
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
    </>
  );
};

export default Navbar;
