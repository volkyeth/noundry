import { useUsername } from "@/hooks/useUsername";
import { Trait } from "@/types/trait";
import { formatTraitType } from "@/utils/traits/format";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from "@nextui-org/react";
import NextLink from "next/link";

import { FC, useState } from "react";
import { LikeWidget } from "./LikeWidget";
import { TraitIcon } from "./TraitIcon";

export interface TraitPreviewCardProps {
  trait: Trait & { liked?: boolean };
}

export const TraitPreviewCard: FC<TraitPreviewCardProps> = ({ trait }) => {
  const [seeThrough, setSeeThrough] = useState(false);
  const author = trait.address;
  const username = useUsername(author);

  return (
    <Card className="p-4 py-2 rounded-none shadow-none light">
      <CardHeader className="p-0 pb-1 flex-row flex justify-between w-full items-start gap-0 rounded-none">
        <div className="flex flex-col items-start ">
          <Link color="foreground" as={NextLink} href={`/trait/${trait.id}`}>
            <h4 className="font-bold pt-1 text-off-dark text-[16px]/4">
              {trait.name}
            </h4>
          </Link>
          <small className="text-off-dark uppercase opacity-30 text-tiny font-semibold">
            {formatTraitType(trait.type)}
          </small>
        </div>

        <TraitIcon
          onMouseEnter={() => setSeeThrough(true)}
          onMouseLeave={() => setSeeThrough(false)}
          type={trait.type}
          className="w-[20px] text-off-dark opacity-30  pt-1 absolute right-4 hover:opacity-10 "
        />
      </CardHeader>
      <CardBody className="overflow-visible items-center p-0 w-[192px]">
        <Link color="foreground" as={NextLink} href={`/trait/${trait.id}`}>
          <div className="w-[192px] h-[192px] bg-default-200" />
          <img
            alt="Trait preview"
            className="absolute w-[192px] h-[192px]"
            src={trait.trait}
            style={{ imageRendering: "pixelated" }}
          />
          <img
            alt="Trait preview"
            className={`absolute w-[192px] h-[192px] ${
              seeThrough ? "opacity-0" : ""
            }`}
            src={trait.nft}
            style={{ imageRendering: "pixelated" }}
          />
        </Link>
      </CardBody>
      <CardFooter className="p-0 pt-1  flex items-start justify-between  rounded-none">
        <Link
          href={`/profile/${author}`}
          as={NextLink}
          color="foreground"
          className="text-sm font-medium text-off-dark"
        >
          {username}
        </Link>
        <LikeWidget
          liked={trait.liked}
          likesCount={trait.likesCount}
          traitId={trait.id}
        />
      </CardFooter>
    </Card>
  );
};
