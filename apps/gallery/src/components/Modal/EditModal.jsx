import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiCaretDown } from "react-icons/bi";
import { FaCheck } from "react-icons/fa";
import { GrClose } from "react-icons/gr";
import { useAccount } from "wagmi";
import BannerModal from "../BannerModal/BannerModal";
import { LoadingNoggles } from "../LoadingNoggles/LoadingNoggles";

const EditModal = ({ setIsModalOpen, nft, updateNft }) => {
  const router = useRouter();
  const [traitsData, setTraitsData] = useState({
    backgrounds: [],
    bodies: [],
    accessories: [],
    heads: [],
    glasses: [],
  });

  const [selectedBackground, setSelectedBackground] = useState("random");
  const [selectedBody, setSelectedBody] = useState("random");
  const [selectedAccessory, setSelectedAccessory] = useState("random");
  const [selectedHead, setSelectedHead] = useState("random");
  const [selectedGlasses, setSelectedGlasses] = useState("random");
  const [twitterHandler, setTwitterHandler] = useState("");

  const [selectedFile, setSelectedFile] = useState(nft.trait);
  const [imageUrl, setimageUrl] = useState(nft.nft);
  const [traitName, setTraitName] = useState(nft.name);
  const [radiovalue, setradisovalue] = useState(nft.type);
  const [isNftGenerated, setIsNftGenerated] = useState(false);

  const [generateRes, setGenerateRes] = useState({});

  const [isGenerating, setIsGenereting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [isBannerOpen, setIsBannerOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { address } = useAccount();

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleBackgroundChange = (event) => {
    setSelectedBackground(event.target.value);
  };
  const handleBodyChange = (event) => {
    setSelectedBody(event.target.value);
  };
  const handleAccessoryChange = (event) => {
    setSelectedAccessory(event.target.value);
  };
  const handleHeadChange = (event) => {
    setSelectedHead(event.target.value);
  };
  const handleGlassesChange = (event) => {
    setSelectedGlasses(event.target.value);
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (event.target.files[0]) {
      const image = document.createElement("img");
      image.src = URL.createObjectURL(selectedFile);

      image.onload = () => {
        if (image.width === 32 && image.height === 32) {
          setSelectedFile(selectedFile);
          setimageUrl(URL.createObjectURL(selectedFile));
          setImageError(false);
        } else {
          setImageError("Images size must be 32x32 px");
        }
      };
    }
  };

  const handleRadioChange = (event) => {
    setradisovalue(event.target.value);
    handleGenerate(event, event.target.value);
  };

  const handleTraitNameChange = (event) => {
    setTraitName(event.target.value.slice(0, 18));
  };

  const handleTwitterChange = (e) => {
    setTwitterHandler(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const formData = new FormData();
    formData.append("id", nft._id);
    formData.append("traitId", nft.traitId);
    formData.append("nft", isNftGenerated ? generateRes.image : nft.nft);
    formData.append("name", traitName);
    formData.append("type", radiovalue);
    formData.append("oldType", nft.type);
    formData.append("twitter", twitterHandler);
    formData.append("userAddress", address);
    formData.append("trait", isNftGenerated ? generateRes.trait : nft.trait);
    formData.append(
      "background",
      isNftGenerated ? generateRes.background : nft.background
    );
    formData.append("body", isNftGenerated ? generateRes.body : nft.body);
    formData.append(
      "head",
      isNftGenerated
        ? generateRes.head
        : nft.type == "heads"
        ? traitName
        : nft.head
    );
    formData.append(
      "accessory",
      isNftGenerated
        ? generateRes.accessory
        : nft.type == "accessories"
        ? traitName
        : nft.accessory
    );
    formData.append(
      "glasses",
      isNftGenerated ? generateRes.glasses : nft.glasses
    );

    const uploadApiRes = await axios.post("/api/editTrait", formData);
    setradisovalue("");
    setIsBannerOpen(true);
    setIsUploading(false);
    updateNft();
  };

  const handleGenerate = async (e, trait = null) => {
    // e.preventDefault();
    setIsGenereting(true);
    const formData = new FormData();
    formData.append("trait", selectedFile);
    formData.append("name", traitName);
    formData.append("type", trait ? trait : radiovalue);
    formData.append("twitter", twitterHandler);

    formData.append("background", selectedBackground);
    formData.append("body", selectedBody);
    formData.append("head", selectedHead);
    formData.append("accessory", selectedAccessory);
    formData.append("glasses", selectedGlasses);

    const generateApiRes = await axios.post("/api/generateNFT", formData);
    setGenerateRes(generateApiRes.data);
    setimageUrl(generateApiRes.data.image);
    setIsGenereting(false);
    setIsNftGenerated(true);
  };

  const deleteNft = async () => {
    const formData = new FormData();
    formData.append("nftId", nft._id);
    formData.append("traitId", nft.traitId);
    formData.append("address", nft.address);
    formData.append("type", nft.type);
    formData.append("likesCount", nft.likesCount);

    setIsDeleting(true);
    axios.post(`/api/deleteTrait`, formData).then((res) => {
      router.push("/");
    });
  };

  useEffect(() => {
    axios.post(`/api/getTraits`).then((res) => {
      setTraitsData(res.data);
    });
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 flex bg-white dark:bg-black bg-opacity-50 dark:bg-opacity-50 justify-center z-[1] h-full w-full overflow-y-scroll overflow-x-hidden `}
      id="exampleModalLg"
      aria-labelledby="exampleModalLgLabel"
      aria-modal="true"
      role="dialog"
    >
      {isBannerOpen ? (
        <BannerModal
          setIsModalOpenBanner={setIsModalOpen}
          className="my-auto"
        />
      ) : isDeleteOpen ? (
        <div className=" my-auto flex gap-4 font-Pix container h-fit p-8 py-20 text-center font-bold flex-col rounded-lg border-1 border-[#4A5568] bg-white text-black bg-clip-padding text-current shadow-lg dark:bg-off-dark">
          <p className="font-Pix text-xl">
            Are you sure you want to delete your trait?
          </p>
          <div className="flex justify-end items-center gap-20 px-8">
            {!isDeleting ? (
              <>
                <button
                  className="flex justify-center bg-light dark:bg-dark rounded-md items-center mt-6 align-middle p-1 px-8 border-1 border-[#4A5568]"
                  onClick={() => {
                    deleteNft();
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={() => {
                    setIsDeleteOpen(false);
                  }}
                  className="flex justify-center bg-light dark:bg-dark rounded-md items-center mt-6 align-middle p-1 px-8 border-1 border-[#4A5568]"
                >
                  No
                </button>
              </>
            ) : (
              <LoadingNoggles />
            )}
          </div>
        </div>
      ) : (
        <div className="flex  container h-fit  flex-col rounded-2xl my-auto border-2 border-[#4A5568] bg-light bg-clip-padding text-current shadow-lg outline-none dark:bg-[#3C4049] text-black py-5 px-10">
          <div className="relative">
            <div className="w-full flex justify-between items-center mb-3 ">
              <div>
                <h1 className="font-bold text-xl">Edit Your Nounish Trait</h1>
              </div>
              <div
                className="h-fit w-fit p-2 border-2 border-off-light rounded-xl cursor-pointer"
                onClick={handleModalClose}
              >
                <GrClose className="text-xl fill-dark dark:fill-light" />
              </div>
            </div>
            <div className="mb-3">
              <div
                className={`relative  bg-[#F9FAFB] dark:bg-[#4A5568] cursor-pointer flex overflow-hidden m-0  text-black dark:text-white text-base w-full  flex-auto rounded-md border border-solid
                                    ${
                                      selectedFile && !imageError
                                        ? "border-[#60B569]"
                                        : "border-off-light dark:border-[#4A5568]"
                                    }   `}
              >
                <p
                  className={`
                  ${
                    selectedFile && !imageError
                      ? "bg-[#B2D3B5] border-[#60B569] !text-black"
                      : "bg-[#EBEBEB] dark:bg-[#16191E] border-off-light dark:border-[#4A5568]"
                  }
                w-1/5 sm:w-1/2 dsm:w-1/2 dmd:w-1/2 text-black dsm:text-sm dark:text-white font-medium border-r-1  pl-8 sm:pl-1 dsm:pl-2 dmd:pl-3 flex items-center cursor-pointer `}
                >
                  Choose File
                </p>
                <p
                  className={`p-2.5 text-ellipsis line-clamp-1 dsm:text-sm cursor-pointer w-4/5 sm:w-1/2 dsm:w-1/2 dmd:w-1/2 ${
                    selectedFile?.name
                      ? "text-black dark:text-white"
                      : imageError
                      ? "text-red-600"
                      : "text-gray-400"
                  } `}
                >
                  {selectedFile?.name ? selectedFile?.name : nft.name}
                </p>
                <input
                  className={`opacity-0 absolute top-1 cursor-pointer file:cursor-pointer `}
                  type="file"
                  id="formFile"
                  accept="image/png"
                  onChange={handleFileChange}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {selectedFile && !imageError ? (
                    <FaCheck
                      fontSize={20}
                      fill="#478558"
                      className="dsm:!text-sm"
                    />
                  ) : null}
                </div>
              </div>
            </div>
            <div className="flex relative w-full">
              <label
                for="trait_name"
                className={`
                ${
                  traitName.length > 0
                    ? "bg-[#B2D3B5] border-[#60B569] !text-black"
                    : "bg-[#EBEBEB] dark:bg-[#16191E] border-off-light dark:border-[#4A5568]"
                }
                w-1/5 sm:w-1/2 dsm:w-1/2 dmd:w-1/2 block mb-2 dsm:text-sm font-medium text-black text-base dark:text-white pl-8 sm:pl-1 dsm:pl-2 dmd:pl-3 py-2 border-y-1 border-l-1  rounded-l-md h-11`}
              >
                Name your trait
              </label>

              <input
                type="text"
                id="trait_name"
                className={`border dsm:text-sm bg-[#F9FAFB] dark:bg-[#4A5568] border-off-light dark:border-[#4A5568] h-11 text-black dark:text-light text-base rounded-r-lg block w-4/5 sm:w-1/2 dsm:w-1/2 dmd:w-1/2  full p-2.5 focus:outline-none
                                  transition duration-300 ease-in-out 
                                  ${
                                    traitName.length > 0
                                      ? "border-[#60B569]"
                                      : "border-off-light dark:border-[#4A5568]"
                                  }`}
                placeholder="ex: Island or Lightning-bolt"
                onChange={handleTraitNameChange}
                required
                value={traitName}
                pattern=".{1,}"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {traitName.length > 0 ? (
                  <FaCheck
                    fontSize={20}
                    fill="#478558"
                    className="dsm:text-sm"
                  />
                ) : null}
              </div>
            </div>

            <div className="flex w-full">
              <label
                for="trait_name"
                className={`${
                  radiovalue != ""
                    ? "bg-[#B2D3B5] border-[#60B569] !text-black"
                    : "bg-[#EBEBEB] dark:bg-[#16191E] border-off-light dark:border-[#4A5568]"
                }  block mb-2 font-medium text-black text-base dark:text-white pl-8 sm:pl-1 dsm:pl-2 dmd:pl-3 py-2 border-1  rounded-md w-1/5 sm:w-1/2 dsm:w-1/2 dmd:w-1/2`}
              >
                Pick Trait Type
              </label>
              <div className="flex gap-5 pl-4 sm:pl-1 dsm:pl-2 dmd:pl-3 w-4/5 sm:w-1/2 dsm:w-1/2 dmd:w-1/2">
                <div className="flex items-center">
                  <div className="form-group block relative w-full">
                    <input
                      type="radio"
                      id="head"
                      name="type"
                      className="form-radio h-5 w-5 dark:text-green-300 text-green-500 checked:border-red checked hidden"
                      value="heads"
                      checked={radiovalue === "heads"}
                      onChange={handleRadioChange}
                    />
                    <label
                      htmlFor="head"
                      className="text-base font-normal text-black dark:text-white relative before:contents-[''] before:relative before:bg-transparent before:inline-block before:align-middle before:cursor-pointer before:border-1 before:border-solid before:border-off-dark before:dark:border-[#4A5568] before:p-[9px] before:mr-2 before:rounded-sm before:bg-[#16191E]"
                    >
                      Head
                    </label>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="form-group block relative">
                    <input
                      type="radio"
                      id="accessory"
                      name="type"
                      className="form-radio border border-white h-5 w-5 text-green-500 hidden"
                      value="accessories"
                      checked={radiovalue === "accessories"}
                      onChange={handleRadioChange}
                    />
                    <label
                      htmlFor="accessory"
                      className="text-base font-normal text-black dark:text-white relative before:contents-[''] before:relative before:bg-transparent before:inline-block before:align-middle before:cursor-pointer before:border-1 before:border-solid before:border-off-dark before:dark:border-[#4A5568] before:p-[9px] before:mr-2 before:rounded-sm before:bg-[#16191E]"
                    >
                      Accessory
                    </label>
                  </div>
                </div>
                {/* <div className="flex items-center mr-16">
                <div className="form-group block relative">
                  <input
                    type="radio"
                    id="glasses"
                    name="type"
                    className="form-radio h-5 w-5 text-green-500 checked:border-red checked hidden"
                    value="glasses"
                    // checked={radiovalue === "glasses"}
                    onChange={handleRadioChange}
                  />
                  <label
                    htmlFor="glasses"
                    className="text-base font-normal text-black relative before:contents-[''] before:relative before:bg-transparent before:inline-block before:align-middle before:cursor-pointer before:border-1 before:border-solid before:border-[#4A5568] before:p-[9px] before:mr-2"
                  >
                    Glasses
                  </label>
                </div>
              </div> */}
              </div>
            </div>
          </div>
          <div
            className={`border border-[#27282D] px-5 py-6 flex flex-row rounded-md dsm:flex-col-reverse dsm:gap-4 justify-around ${
              traitName == "" || radiovalue == false
                ? "bg-[#DEDEDE] dark:bg-[#2D2F35]"
                : "bg-[#FCFCFC] dark:bg-[#3C4049]"
            }`}
          >
            <div className="flex flex-col gap-2 ">
              <button
                onClick={handleGenerate}
                className={`overflow-hidden max-h-11 border-1 border-[#4A5568] w-full p-0 py-2 rounded-lg text-base font-medium text-black dark:text-white justify-center flex `}
                disabled={traitName == "" || radiovalue == false ? true : false}
              >
                {isGenerating ? (
                  <LoadingNoggles className={"h-full !my-0"} />
                ) : (
                  "Generate"
                )}
              </button>
              <div className=" relative border-1 border-[#4A5568] rounded-lg ">
                <select
                  id="floatingSelect"
                  className={`flex text-black dark:text-white bg-transparent items-center justify-between w-52 gap-12  px-4 p-2 pt-4 text-base font-medium appearance-none focus:outline-none ${
                    selectedBackground ? "border-blue-500" : "border-gray-300"
                  }`}
                  onChange={handleBackgroundChange}
                  disabled={
                    traitName == "" || radiovalue == false ? true : false
                  }
                  value={selectedBackground}
                >
                  <option className="dark:bg-[#16191E]" value="random" selected>
                    Random
                  </option>
                  {traitsData.backgrounds.sort().map((traitName, i) => (
                    <option
                      key={i}
                      className="dark:bg-[#16191E]"
                      value={traitName}
                    >
                      {traitName}
                    </option>
                  ))}
                </select>
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <BiCaretDown fontSize={20} color="#4A5568" />
                </span>
                <label
                  htmlFor="floatingSelect"
                  className={`absolute top-[3px] left-3 px-1 text-xs ${
                    selectedBackground
                      ? "bg-transparent text-gray-500"
                      : "bg-transparent text-gray-500"
                  } transition-all`}
                >
                  Background
                </label>
              </div>
              <div className="relative border-1 border-[#4A5568] rounded-lg">
                <select
                  id="floatingSelect1"
                  className={`flex bg-transparent  text-black dark:text-white items-center justify-between w-52 gap-12  px-4 p-2 pt-4 text-base font-medium appearance-none focus:outline-none  ${
                    selectedBody ? "border-blue-500" : "border-gray-300"
                  }`}
                  onChange={handleBodyChange}
                  disabled={
                    traitName == "" || radiovalue == false ? true : false
                  }
                  value={selectedBody}
                >
                  <option className="dark:bg-[#16191E]" value="random" selected>
                    Random
                  </option>
                  {traitsData.bodies.sort().map((traitName, i) => (
                    <option
                      key={i}
                      className="dark:bg-[#16191E]"
                      value={traitName}
                    >
                      {traitName}
                    </option>
                  ))}
                </select>
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <BiCaretDown fontSize={20} color="#4A5568" />
                </span>
                <label
                  htmlFor="floatingSelect1"
                  className={`absolute top-[3px] left-3 px-1 text-xs ${
                    selectedBody
                      ? "bg-transparent text-gray-500"
                      : "bg-transparent text-gray-500"
                  } transition-all`}
                >
                  Body
                </label>
              </div>
              <div className="relative border-1 border-[#4A5568] rounded-lg">
                <select
                  id="floatingSelect2"
                  className={`flex bg-transparent text-black dark:text-white  items-center justify-between w-52 gap-12  px-4 p-2 pt-4 text-base font-medium appearance-none focus:outline-none  ${
                    selectedAccessory ? "border-blue-500" : "border-gray-300"
                  }`}
                  onChange={handleAccessoryChange}
                  disabled={
                    traitName == "" || radiovalue == "accessories"
                      ? true
                      : false
                  }
                  value={selectedAccessory}
                >
                  {radiovalue == "accessories" ? (
                    <option
                      className="dark:bg-[#16191E]"
                      selected
                      value={traitName}
                    >
                      {traitName}
                    </option>
                  ) : (
                    <option
                      className="dark:bg-[#16191E]"
                      value="random"
                      selected
                    >
                      Random
                    </option>
                  )}
                  {traitsData.accessories.sort().map((traitName, i) => (
                    <option
                      key={i}
                      className="dark:bg-[#16191E]"
                      value={traitName}
                    >
                      {traitName}
                    </option>
                  ))}
                </select>
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <BiCaretDown fontSize={20} color="#4A5568" />
                </span>
                <label
                  htmlFor="floatingSelect2"
                  className={`absolute top-[3px] left-3 px-1 text-xs ${
                    selectedAccessory
                      ? "bg-transparent text-gray-500"
                      : "bg-transparent text-gray-500"
                  } transition-all`}
                >
                  Accessory
                </label>
              </div>
              <div className="relative border-1 border-[#4A5568] rounded-lg">
                <select
                  id="floatingSelect3"
                  className={`flex bg-transparent items-center text-black dark:text-white  justify-between w-52 gap-12  px-4 p-2 pt-4 text-base font-medium appearance-none focus:outline-none  ${
                    handleHeadChange || radiovalue == "glasses"
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                  onChange={handleHeadChange}
                  disabled={
                    traitName == "" || radiovalue == "heads" ? true : false
                  }
                  value={selectedHead}
                >
                  {radiovalue == "heads" ? (
                    <option
                      className="dark:bg-[#16191E]"
                      selected
                      value={traitName}
                    >
                      {traitName}
                    </option>
                  ) : (
                    <option
                      className="dark:bg-[#16191E]"
                      value="random"
                      selected
                    >
                      Random
                    </option>
                  )}

                  {traitsData.heads.sort().map((traitName, i) => (
                    <option
                      key={i}
                      className="dark:bg-[#16191E]"
                      value={traitName}
                    >
                      {traitName}
                    </option>
                  ))}
                </select>
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <BiCaretDown fontSize={20} color="#4A5568" />
                </span>
                <label
                  htmlFor="floatingSelect3"
                  className={`absolute top-[3px] left-3 px-1 text-xs ${
                    handleHeadChange
                      ? "bg-transparent text-gray-500"
                      : "bg-transparent text-gray-500"
                  } transition-all`}
                >
                  Head
                </label>
              </div>
              <div className="relative border-1 border-[#4A5568] rounded-lg">
                <select
                  id="floatingSelect4"
                  className={`flex bg-transparent items-center text-black dark:text-white  justify-between w-52 gap-12  px-4 p-2 pt-4 text-base font-medium appearance-none focus:outline-none  ${
                    selectedGlasses || radiovalue == "glasses"
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                  onChange={handleGlassesChange}
                  disabled={
                    traitName == "" || radiovalue == "glasses" ? true : false
                  }
                  value={selectedGlasses}
                >
                  {radiovalue == "glasses" ? (
                    <option
                      className="dark:bg-[#16191E]"
                      selected
                      value={traitName}
                    >
                      {traitName}
                    </option>
                  ) : (
                    <option
                      className="dark:bg-[#16191E]"
                      value="random"
                      selected
                    >
                      Random
                    </option>
                  )}

                  {traitsData.glasses.sort().map((traitName, i) => (
                    <option
                      key={i}
                      className="dark:bg-[#16191E]"
                      value={traitName}
                    >
                      {traitName}
                    </option>
                  ))}
                </select>
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <BiCaretDown fontSize={20} color="#4A5568" />
                </span>
                <label
                  htmlFor="floatingSelect4"
                  className={`absolute top-[3px] left-3 px-1 text-xs ${
                    selectedGlasses
                      ? "bg-transparent text-gray-500"
                      : "bg-transparent text-gray-500"
                  } transition-all`}
                >
                  Glasses
                </label>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <div className="w-[288px] h-[288px] relative ">
                <img
                  className="w-full h-full"
                  style={{ objectFit: "cover", imageRendering: "pixelated" }}
                  src={imageUrl}
                  fill={true}
                  alt="Image"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-around  py-6">
            <div className="flex flex-col max-h-11 2xl:!flex-row xl:flex-row lg:flex-row md:flex-col justify-between w-full gap-3 items-center">
              {isUploading ? (
                <div className="w-full flex justify-center">
                  <LoadingNoggles className={"!h-full"} />
                </div>
              ) : (
                <div className="w-full flex gap-2">
                  <button
                    onClick={() => {
                      setIsDeleteOpen(true);
                    }}
                    className="border-1 w-1/2 border-[#4A5568] disabled:bg-[#4A5568] bg-[#27282D] px-[110px] py-2 rounded-lg text-lg font-bold text-white"
                  >
                    Delete
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="border-1 w-1/2 border-[#4A5568] disabled:bg-[#4A5568] bg-[#27282D] px-[110px] py-2 rounded-lg text-lg font-bold text-white"
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditModal;
