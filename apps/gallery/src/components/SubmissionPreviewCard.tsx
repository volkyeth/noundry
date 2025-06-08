import { useUsername } from "@/hooks/useUsername";
import { Trait } from "@/types/trait";
import { formatSubmissionType } from "@/utils/traits/format";
import { appConfig } from "@/variants/config";
const { LoadingNoggles, loadingNoun } = appConfig;
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  cn,
  Link,
} from "@nextui-org/react";
import NextLink from "next/link";

import { forwardRef, useState } from "react";
import { LikeWidget } from "./LikeWidget";
import { Skeleton } from "./Skeleton";
import { SubmissionIcon } from "./SubmissionIcon";

export interface SubmissionPreviewCardProps {
  trait?: Trait & { liked?: boolean };
}

export const SubmissionPreviewCard = forwardRef<
  HTMLDivElement,
  SubmissionPreviewCardProps
>(({ trait }, ref) => {
  const [seeThrough, setSeeThrough] = useState(false);
  const username = useUsername(trait?.address);

  return (
    <Card className="p-4 py-2 rounded-none light shadow-sm" ref={ref}>
      <CardHeader className="p-0 pb-1 flex-row flex justify-between w-full items-start gap-0 rounded-none">
        <div className="flex flex-col items-start ">
          {trait ? (
            <Link color="foreground" as={NextLink} href={`/trait/${trait.id}`}>
              <p className="font-bold pt-1 text-secondary text-[16px]/4">
                {trait.name}
              </p>
            </Link>
          ) : (
            <div className="h-[20px] flex items-end mb-[2px]">
              <Skeleton className="h-4 w-20" />
            </div>
          )}
          {trait ? (
            <small className="text-secondary opacity-30 text-tiny font-bold tracking-wide">
              {trait.version === 1 ? "OG" : `v${trait.version}`}
            </small>
          ) : (
            <Skeleton className="h-3 w-9 mt-[2px]" />
          )}
        </div>

        <div className="flex flex-col items-end">
          {trait ? (
            <SubmissionIcon
              onMouseEnter={
                trait.type !== "nouns" ? () => setSeeThrough(true) : undefined
              }
              onMouseLeave={
                trait.type !== "nouns" ? () => setSeeThrough(false) : undefined
              }
              type={trait.type}
              className={cn(
                "w-[16px] text-dark opacity-50  pt-1   ",
                trait.type !== "nouns" && "hover:opacity-20",
              )}
            />
          ) : (
            <Skeleton className="w-[20px] h-[20px] mt-1" />
          )}
          {trait ? (
            <small className="text-secondary uppercase opacity-30 text-tiny font-bold tracking-wide">
              {formatSubmissionType(trait.type)}
            </small>
          ) : (
            <Skeleton className="h-3 w-9 mb-[2px]" />
          )}
        </div>
      </CardHeader>
      <CardBody className="overflow-visible items-center flex-none p-0 w-[192px] h-[192px]">
        <Link
          color="foreground"
          as={NextLink}
          href={trait ? `/trait/${trait.id}` : ""}
        >
          <div className="w-[192px] h-[192px] bg-checkerboard" />
          {trait && (
            <img
              alt="Trait preview"
              className="absolute w-[192px] h-[192px] pixelated"
              src={trait.trait}
            />
          )}
          <img
            alt="Trait preview"
            className={`absolute w-[192px] h-[192px] pixelated ${
              seeThrough ? "opacity-0" : ""
            } bg-default-200`}
            src={trait?.nft || loadingNoun.src}
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
});

SubmissionPreviewCard.displayName = "TraitPreviewCard";
