"use client";
import { LoadingNoggles } from "@/components/LoadingNoggles/LoadingNoggles";
import EditModal from "@/components/Modal/EditModal";
import axios from "axios";
import { useModal, useSIWE } from "connectkit";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsSuitHeartFill } from "react-icons/bs";
import { useAccount } from "wagmi";

export const getServerSideProps = async () => {
  return { props: {} };
};

const UserTrait = () => {
  const { openSIWE } = useModal();
  const { isSignedIn } = useSIWE();
  const [nft, setNft] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isGenerateLoading, setIsGenerateLoading] = useState(false);
  const [generatedNfts, setGeneratedNfts] = useState([]);
  const { isConnected, address } = useAccount();
  const [like, setLike] = useState(0);
  const [isLike, setIsLike] = useState(false);
  const [localAddress, setLocalAddress] = useState("");
  const {
    query: { id },
  } = useRouter();

  const updateNft = () => {
    axios
      .post(`/api/getNft?id=${id}`)
      // .post(`/api/getNft?id=6502b90f8b7753fd6458103e`)
      .then((getNftApiRes) => {
        setNft(getNftApiRes.data);
        setLike(getNftApiRes.data.likesCount);
      })
      .catch((getNftApiError) => {});
  };

  useEffect(() => {
    setLocalAddress(address);
  }, [isConnected]);

  useEffect(() => {
    setIsLoading(true);

    axios
      .post(`/api/getNft?id=${id}`)
      // .post(`/api/getNft?id=6502b90f8b7753fd6458103e`)e
      .then(async (getNftApiRes) => {
        setNft(getNftApiRes.data);
        setLike(getNftApiRes.data.likesCount);
        const formData = new FormData();
        formData.append(
          "trait",
          getNftApiRes.data.type == "heads"
            ? getNftApiRes.data.head
            : getNftApiRes.data.type == "accessories"
            ? getNftApiRes.data.accessory
            : getNftApiRes.data.glasses
        );
        formData.append("type", getNftApiRes.data.type);

        formData.append("background", "random");
        formData.append("body", "random");
        formData.append(
          "head",
          getNftApiRes.data.type == "heads" ? getNftApiRes.data.head : "random"
        );
        formData.append(
          "accessory",
          getNftApiRes.data.type == "accessories"
            ? getNftApiRes.data.accessory
            : "random"
        );
        formData.append(
          "glasses",
          getNftApiRes.data.type == "glasses"
            ? getNftApiRes.data.glasses
            : "random"
        );
        const res = await axios.post("/api/generateNFTs", formData);
        setGeneratedNfts([...generatedNfts, ...res.data.images]);
        setIsLoading(false);
      });
  }, []);

  const handleLike = async () => {
    if (isConnected && isLike == false) {
      if (nft.address != address && !nft?.likedBy?.includes(address)) {
        setLike(like + 1);
        setIsLike(true);
        const addLikeApiRes = await axios.post("/api/addLike", {
          ...nft,
          liker: address,
        });
      }
    }
  };
  const handleGenerate = async () => {
    setIsGenerateLoading(true);
    const formData = new FormData();
    formData.append(
      "trait",
      nft.type == "heads"
        ? nft.head
        : nft.type == "accessories"
        ? nft.accessory
        : nft.glasses
    );
    formData.append("type", nft.type);

    formData.append("background", "random");
    formData.append("body", "random");
    formData.append("head", nft.type == "heads" ? nft.head : "random");
    formData.append(
      "accessory",
      nft.type == "accessories" ? nft.accessory : "random"
    );
    formData.append("glasses", nft.type == "glasses" ? nft.glasses : "random");
    const res = await axios.post("/api/generateNFTs", formData);
    setGeneratedNfts([...res.data.images, ...generatedNfts]);
    setIsGenerateLoading(false);
  };

  return (
    <>
      <div className="container mx-auto px-10">
        <div className="bg-white dark:bg-[#27282D] container mx-auto my-5 text-black dark:text-white py-8  rounded-xl">
          <div className="px-[50px] 2xl:!px-[200px] xl:!px-[150px] lg:!px-[130px] md:!px-[100px] sm:!px-[50px]">
            {/* <div className="container px-[100px] 2xl:!px-[200px] xl:!px-[150px] lg:!px-[130px] md:!px-[100px] sm:!px-[50px]"> */}
            <div className="flex justify-between items-center">
              <h1 className="font-Pix text-sm text-black dark:text-white">
                {nft.name}
              </h1>
              {nft.address == localAddress ? (
                <button
                  onClick={() => {
                    if (!isSignedIn) return openSIWE();

                    setIsEditOpen(true);
                  }}
                  className="flex justify-center bg-light dark:bg-dark rounded-md items-center align-middle p-1 px-2 border-1 border-[#4A5568] text-sm"
                >
                  Edit Trait
                </button>
              ) : null}
            </div>
            <p className="text-sm text-black dark:text-white">
              {nft.type == "heads" ? "Head" : "Accessory"} Trait
            </p>
            <div className="flex items-center w-full py-3">
              <img
                style={{
                  objectFit: "fill",
                  width: "100%",
                  imageRendering: "pixelated",
                }}
                src={nft?.nft}
                alt="Image"
              />
            </div>
            <div className="flex justify-between text-black dark:text-white">
              <p>
                Created on {moment(nft?.creationDate).format("DD/MM/YYYY")} by{" "}
                <a
                  href={`/profile/${nft?.address}`}
                  className="mx-1 font-bold hover:text-primary"
                >
                  {nft
                    ? nft.user && nft.user[0] && nft.user[0].userName
                      ? `${nft.user[0].userName}`
                      : `${nft.address?.slice(0, 6)}...${nft.address?.slice(
                          38
                        )}`
                    : `${nft?.address?.slice(0, 6)}...${nft?.address?.slice(
                        38
                      )}`}
                </a>
              </p>
              <p className="flex items-center gap-2 text-black dark:text-white">
                <BsSuitHeartFill
                  color="#FF2165"
                  onClick={handleLike}
                  className="cursor-pointer"
                />
                {like}
              </p>
            </div>
            <button
              className="w-fit text-white bg-primary p-2 max-h-11 h-11 min-h-11 px-6 font-bold border-1 border-[#1F1D28] dark:border-white rounded-lg mt-10"
              onClick={handleGenerate}
            >
              {isGenerateLoading ? (
                <LoadingNoggles className={"h-full !my-0 !w-11/12"} />
              ) : (
                "Generate"
              )}
            </button>
            {/* {isGenerateLoading ? (
              <div className="flex w-full justify-center">
                <div className="custom-loader"></div>
              </div>
            ) : null} */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-3 2xl:grid-cols-4 sm:grid-cols-1 gap-4 py-6">
              {generatedNfts.map((generatedNft, i) => (
                // <div key={igrid.id} className="w-full flex h-full justify-self-center">
                <div
                  key={i}
                  className="w-fit flex flex-col justify-center items-center gap-2 justify-self-center"
                >
                  <img
                    src={generatedNft}
                    width={130}
                    height={100}
                    style={{
                      objectFit: "fill",
                      borderRadius: "12px",
                      imageRendering: "pixelated",
                    }}
                    alt="Image"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="bg-[#F5F5F5] dark:bg-[#24272F] fixed top-0 w-full h-full flex justify-center items-center">
          <LoadingNoggles />
        </div>
      ) : null}
      {isEditOpen ? (
        <EditModal
          setIsModalOpen={setIsEditOpen}
          nft={nft}
          updateNft={updateNft}
        />
      ) : null}
    </>
  );
};

export default UserTrait;
