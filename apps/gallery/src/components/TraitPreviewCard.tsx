import { useUsername } from "@/hooks/useUsername";
import { Trait } from "@/types/trait";
import { formatTraitType } from "@/utils/traits/format";
import loadingNoun from "public/loading-noun.gif";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from "@nextui-org/react";
import NextLink from "next/link";
import LoadingNoggles from "public/loading-noggles.svg";

import { FC, useState } from "react";
import { LikeWidget } from "./LikeWidget";
import { Skeleton } from "./Skeleton";
import { TraitIcon } from "./TraitIcon";

export interface TraitPreviewCardProps {
  trait?: Trait & { liked?: boolean };
}

export const TraitPreviewCard: FC<TraitPreviewCardProps> = ({ trait }) => {
  const [seeThrough, setSeeThrough] = useState(false);
  const username = useUsername(trait?.address);

  return (
    <Card className="p-4 py-2 rounded-none shadow-none light">
      <CardHeader className="p-0 pb-1 flex-row flex justify-between w-full items-start gap-0 rounded-none">
        <div className="flex flex-col items-start ">
          {trait ? (
            <Link color="foreground" as={NextLink} href={`/trait/${trait.id}`}>
              <h4 className="font-bold pt-1 text-off-dark text-[16px]/4">
                {trait.name}
              </h4>
            </Link>
          ) : (
            <div className="h-[20px] flex items-end mb-[2px]">
              <Skeleton className="h-4 w-20" />
            </div>
          )}
          {trait ? (
            <small className="text-off-dark uppercase opacity-30 text-tiny font-semibold">
              {formatTraitType(trait.type)}
            </small>
          ) : (
            <Skeleton className="h-3 w-9 mb-[2px]" />
          )}
        </div>

        {trait ? (
          <TraitIcon
            onMouseEnter={() => setSeeThrough(true)}
            onMouseLeave={() => setSeeThrough(false)}
            type={trait.type}
            className="w-[20px] text-off-dark opacity-30  pt-1 absolute right-4 hover:opacity-10 "
          />
        ) : (
          <Skeleton className="w-[20px] h-[20px] mt-1" />
        )}
      </CardHeader>
      <CardBody className="overflow-visible items-center flex-none p-0 w-[192px] h-[192px]">
        <Link
          color="foreground"
          as={NextLink}
          href={trait ? `/trait/${trait.id}` : ""}
        >
          <div className="w-[192px] h-[192px] bg-default-200" />
          {trait && (
            <img
              alt="Trait preview"
              className="absolute w-[192px] h-[192px]"
              src={trait.trait}
              style={{ imageRendering: "pixelated" }}
            />
          )}
          <img
            alt="Trait preview"
            className={`absolute w-[192px] h-[192px] ${
              seeThrough ? "opacity-0" : ""
            }`}
            src={trait?.nft || loadingNoun.src}
            style={{ imageRendering: "pixelated" }}
          />
        </Link>
      </CardBody>
      <CardFooter className="p-0 pt-1  flex items-start justify-between  rounded-none">
        {trait ? (
          <Link
            href={`/profile/${trait.address}`}
            as={NextLink}
            color="foreground"
            className="text-sm font-medium text-off-dark"
          >
            {username}
          </Link>
        ) : (
          <div className="h-5 flex items-center">
            <Skeleton className="h-3 w-20" />
          </div>
        )}
        {trait ? (
          <LikeWidget
            liked={trait.liked}
            likesCount={trait.likesCount}
            traitId={trait.id}
          />
        ) : (
          <div className="h-5 flex items-center gap-1">
            <LoadingNoggles className="w-[32px] text-default-300" />
            <Skeleton className="h-3 w-3" />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
