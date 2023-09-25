import axios from "axios";
import Link from "next/link";
import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { BsSuitHeartFill } from "react-icons/bs";
import { useAccount } from "wagmi";
import headIcon from "public/HeadIcon.svg";
import dummyImg from "public/dummyImg.png";
import accssoryIcon from "public/AccessoryIcon.svg";
import { MainContext } from "../../pages/_app";

const NFTCard = ({ nft }) => {
  const [like, setLike] = useState(nft.likesCount);
  const [isLike, setIsLike] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);
  let { trigger, setTrigger } = useContext(MainContext);
  const { isConnected, address } = useAccount();

  const handleLike = async () => {
    if (isConnected) {
      try {
        if (!showModal && !loading) {
          if (nft.address !== address) {
            if (!nft?.likedBy?.includes(address)) {
              setLike(like + 1);
              setIsLike(true);
            } else {
              setLike(like - 1);
              setIsLike(false);
            }
            setLoading(true);
            const likeApiRes = await axios.post("/api/addLike", {
              ...nft,
              liker: address,
            });

            setLoading(false);
            setTrigger(trigger + 1);
          }
        }
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    } else {
      setShowModal(true);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 900);
  }, []);

  useEffect(() => {
    setLike(nft.likesCount);
  }, [nft]);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };
    if (showModal) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showModal]);

  return (
    <>
      <div className="bg-white shadow-md dark:shadow-lg dark:shadow-[000] p-2 ">
        <div className="relative ">
          {/* Main Image */}
          <Link href={`/UserTrait/${nft._id}`}>
            <div className="h-full hover:opacity-70 w-full ">
              <img
                src={nft?.nft}
                style={{ imageRendering: "pixelated" }}
                className="h-full w-full object-cover object-center"
                alt="Image"
              />
            </div>
          </Link>
          <div className="flex justify-between pt-2">
            <div className="flex justify-center items-center gap-2">
              {nft?.user ? (
                <img
                  src={
                    nft?.user[0]?.profilePic
                      ? nft?.user[0]?.profilePic
                      : dummyImg.src
                  }
                  alt={nft.name}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <img
                  src={nft.type === "heads" ? headIcon.src : accssoryIcon.src}
                  alt={nft.name}
                  className="h-6 w-6"
                />
              )}
              <div className="flex ">
                <img
                  src={nft.type === "heads" ? headIcon.src : accssoryIcon.src}
                  width={20}
                  height={20}
                  alt="Icon"
                />
                <p className="mr-2 ml-2 text-black">{nft.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <BsSuitHeartFill
                color="#FF2165"
                onClick={handleLike}
                className={`cursor-pointer ${loading ? "opacity-50" : ""}`}
              />
              <p className="text-black">{like}</p>
            </div>
          </div>
        </div>
      </div>

      {/* modal*/}

      {showModal && (
        <div
          className={`fixed top-0 left-0 flex bg-white dark:bg-black bg-opacity-50 dark:bg-opacity-50 justify-center z-[1] h-full w-full overflow-y-scroll overflow-x-hidden `}
          id="exampleModalLg"
          aria-labelledby="exampleModalLgLabel"
          aria-modal="true"
          role="dialog"
        >
          <div
            ref={modalRef}
            className=" my-auto flex gap-4 font-Pix container h-fit p-8 py-20 text-center font-bold flex-col rounded-lg border-1 border-[#4A5568] bg-white text-black bg-clip-padding text-current shadow-lg dark:bg-off-dark"
          >
            <p className="font-Pix text-xl">
              please connect your wallet to continue.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default NFTCard;
