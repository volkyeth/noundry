import { Trait } from "@/types/trait";
import { formatTraitType } from "@/utils/traits/format";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from "@nextui-org/react";
import axios from "axios";
import { useModal, useSIWE } from "connectkit";
import NextLink from "next/link";
import accssoryIcon from "public/AccessoryIcon.svg";
import headIcon from "public/HeadIcon.svg";
import dummyImg from "public/dummyImg.png";
import NogglesIcon from "public/noggles.svg";
import { FC, useEffect, useState } from "react";
import { BsSuitHeartFill } from "react-icons/bs";
import { useAccount } from "wagmi";
import { SmallAccountBadge } from "./SmallAccountBadge";

export interface TraitCardProps {
  trait: Trait;
}

const TraitCard: FC<TraitCardProps> = ({ trait }) => {
  const author = trait.address;
  const { openSIWE } = useModal();
  const { isSignedIn } = useSIWE();
  const [like, setLike] = useState(trait.likesCount);
  const [isLike, setIsLike] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isConnected, address } = useAccount();

  const handleLike = async () => {
    if (!isSignedIn || !address || !isConnected) return openSIWE();

    if (loading) return;

    if (trait.address !== address) {
      if (!trait?.likedBy?.includes(address)) {
        setLike(like + 1);
        setIsLike(true);
      } else {
        setLike(like - 1);
        setIsLike(false);
      }
      setLoading(true);
      await axios.post("/api/addLike", {
        ...trait,
        liker: address,
      });

      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 900);
  }, []);

  useEffect(() => {
    setLike(trait.likesCount);
  }, [trait]);

  return (
    <Card className="p-4 py-3  rounded-none shadow-none">
      <CardHeader className="p-0 pb-1 flex-col flex items-start gap-0 rounded-none">
        <h4 className="font-bold text-[16px]">{trait.name}</h4>

        <div className="flex flex-row justify-between items-end w-full">
          <small className="text-default-300 text-tiny uppercase font-bold">
            {formatTraitType(trait.type)}
          </small>

          <div className="flex items-center gap-1">
            <NogglesIcon className="w-[32px] text-[#ff2165] opacity-25" />

            <p className="text-sm text-default-300">{like}</p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-visible items-center p-0 ">
        <img
          alt="Trait preview"
          className="w-[192px] h-[192px]"
          src={trait.nft}
          style={{ imageRendering: "pixelated" }}
        />
      </CardBody>
      <CardFooter className="p-0 pt-2">
        <Link href={`/profile/${author}`} as={NextLink} color="foreground">
          <SmallAccountBadge address={author} />
        </Link>
      </CardFooter>
    </Card>
  );

  return (
    <div className="bg-white shadow-md dark:shadow-lg dark:shadow-[000] p-2 ">
      <div className="relative ">
        {/* Main Image */}
        <Link href={`/UserTrait/${trait._id}`}>
          <div className="h-full hover:opacity-70 w-full ">
            <img
              src={trait?.nft}
              style={{ imageRendering: "pixelated" }}
              className="h-full w-full object-cover object-center"
              alt="Image"
            />
          </div>
        </Link>
        <div className="flex justify-between pt-2">
          <div className="flex justify-center items-center gap-2">
            {trait?.user ? (
              <img
                src={
                  trait?.user[0]?.profilePic
                    ? trait?.user[0]?.profilePic
                    : dummyImg.src
                }
                alt={trait.name}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <img
                src={trait.type === "heads" ? headIcon.src : accssoryIcon.src}
                alt={trait.name}
                className="h-6 w-6"
              />
            )}
            <div className="flex ">
              <img
                src={trait.type === "heads" ? headIcon.src : accssoryIcon.src}
                width={20}
                height={20}
                alt="Icon"
              />
              <p className="mr-2 ml-2 text-black">{trait.name}</p>
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
  );
};

export default TraitCard;
