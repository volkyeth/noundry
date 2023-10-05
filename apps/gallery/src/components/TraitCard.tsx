import { Trait } from "@/types/trait";
import { formatTraitType } from "@/utils/traits/format";
import { useUsername } from "@/utils/user/useUsername";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import NextLink from "next/link";
import LoadingNoggles from "public/loading-noggles.svg";
import NoggleIcon from "public/mono-noggles.svg";
import { FC } from "react";
import { TraitIcon } from "./TraitIcon";

export interface TraitCardProps {
  trait: Trait & { liked?: boolean };
}

const TraitCard: FC<TraitCardProps> = ({ trait }) => {
  const author = trait.address;
  const username = useUsername(author);
  const {
    data: currentlyLiked,
    isLoading: liking,
    mutate: toggleLike,
  } = useMutation({
    mutationFn: (isLiked: boolean) =>
      fetch(`/api/like/${trait._id}`, {
        method: isLiked ? "DELETE" : "PUT",
      }).then(() => !isLiked),
  });
  const initiallyLiked = trait.liked;

  const liked = currentlyLiked === undefined ? initiallyLiked : currentlyLiked;
  const likesCount =
    currentlyLiked === undefined || currentlyLiked === initiallyLiked
      ? trait.likesCount
      : currentlyLiked
      ? trait.likesCount + 1
      : trait.likesCount - 1;

  return (
    <Card className="p-4  rounded-none shadow-none light">
      <CardHeader className="p-0 pb-1 flex-row flex justify-between w-full items-start gap-0 rounded-none">
        <div className="flex flex-col  items-start ">
          <Link
            color="foreground"
            as={NextLink}
            href={`/UserTrait/${trait._id}`}
          >
            <h4 className="font-bold text-[16px]/4">{trait.name}</h4>
          </Link>
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
      <CardFooter className="p-0 pt-1  flex items-start justify-between  rounded-none">
        <Link
          href={`/profile/${author}`}
          as={NextLink}
          color="foreground"
          className="text-sm text-default-500"
        >
          {username}
        </Link>
        <div
          className={`flex gap-1 ${
            liked ? "text-primary" : "text-default-300"
          }`}
        >
          {liking ? (
            <LoadingNoggles className="w-[32px]" />
          ) : (
            <NoggleIcon
              onClick={() => liked !== undefined && toggleLike(liked)}
              className={`w-[32px] cursor-pointer hover:${
                liked ? "text-default-200" : "text-primary"
              }`}
            />
          )}
          <small className="text-sm">{likesCount}</small>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TraitCard;
