import { Trait } from "@/types/trait";
import { formatTraitType } from "@/utils/traits/format";
import { useUsername } from "@/utils/user/useUserName";
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
import NoggleIcon from "public/mono-noggles.svg";
import { FC, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { TraitIcon } from "./TraitIcon";

export interface TraitCardProps {
  trait: Trait;
}

const TraitCard: FC<TraitCardProps> = ({ trait }) => {
  const author = trait.address;
  const username = useUsername(author);
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
    <NextLink href={`/UserTrait/${trait._id}`}>
      <Card className="p-4 py-3  rounded-none shadow-none light">
        <CardHeader className="p-0 pb-1 flex-row flex justify-between w-full items-start gap-0 rounded-none">
          <div className="flex flex-col  items-start ">
            <h4 className="font-bold text-[16px]/4">{trait.name}</h4>
            <small className="text-default-300 text-tiny uppercase font-bold">
              {formatTraitType(trait.type)}
            </small>
          </div>
          <TraitIcon
            type={trait.type}
            className="w-[20px] text-default-300 absolute right-3"
          />
        </CardHeader>
        <CardBody className="overflow-visible items-center p-0 w-[192px]">
          <div className="w-[192px] h-[192px] bg-default-200" />
          <img
            alt="Trait preview"
            className="absolute w-[192px] h-[192px]"
            src={trait.trait}
            style={{ imageRendering: "pixelated" }}
          />
          <img
            alt="Trait preview"
            className="absolute w-[192px] h-[192px] hover:opacity-0"
            src={trait.nft}
            style={{ imageRendering: "pixelated" }}
          />
        </CardBody>
        <CardFooter className="p-0  flex items-start justify-between  rounded-none">
          <Link
            href={`/profile/${author}`}
            as={NextLink}
            color="foreground"
            className="text-sm text-default-500"
          >
            {username}
          </Link>
          <div className="flex gap-1 text-default-300">
            <NoggleIcon className="w-[32px] " />
            <small className="text-sm">{trait.likesCount}</small>
          </div>
        </CardFooter>
      </Card>
    </NextLink>
  );
};

export default TraitCard;
