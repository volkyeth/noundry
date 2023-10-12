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
import { formatDistanceToNow } from "date-fns";
import NextLink from "next/link";

import { FC, useState } from "react";
import { LikeWidget } from "./LikeWidget";
import { SmallAccountBadge } from "./SmallAccountBadge";
import { TraitIcon } from "./TraitIcon";

export interface TraitCardProps {
  trait: Trait & { liked?: boolean };
}

export const TraitCard: FC<TraitCardProps> = ({ trait }) => {
  const [seeThrough, setSeeThrough] = useState(false);
  const author = trait.address;
  const username = useUsername(author);

  return (
    <Card className="p-4 xs:p-6 rounded-none shadow-none w-fit h-fit flex-shrink-0">
      <CardHeader className="p-0 pb-1 flex-row flex justify-between w-full items-start gap-0 rounded-none">
        <div className="flex flex-col  items-start ">
          <h4 className="font-bold text-2xl">{trait.name}</h4>
          <small className="text-default-300 text-tiny uppercase font-bold">
            {formatTraitType(trait.type)}
          </small>
        </div>

        <TraitIcon
          onMouseEnter={() => setSeeThrough(true)}
          onMouseLeave={() => setSeeThrough(false)}
          type={trait.type}
          className="w-[32px] text-default-300 absolute right-6 hover:text-default-200"
        />
      </CardHeader>
      <CardBody className="overflow-visible items-center p-0 w-fit">
        <div className="relative w-[256px] h-[256px] xs:w-[320px] xs:h-[320px] bg-default-200">
          <img
            alt="Trait preview"
            className="absolute w-full h-full"
            src={trait.trait}
            style={{ imageRendering: "pixelated" }}
          />
          <img
            alt="Trait preview"
            className={`absolute w-full h-full ${
              seeThrough ? "opacity-0" : ""
            }`}
            src={trait.nft}
            style={{ imageRendering: "pixelated" }}
          />
        </div>
      </CardBody>
      <CardFooter className="p-0 pt-1  flex items-end justify-between  rounded-none">
        <div className="flex flex-col gap-2">
          <p className="text-sm  text-default-300">
            {formatDistanceToNow(trait.creationDate, { addSuffix: true })} by
          </p>
          <Link
            href={`/profile/${author}`}
            as={NextLink}
            color="foreground"
            className="text-sm text-default-500"
          >
            <SmallAccountBadge address={author} />
          </Link>
        </div>
        <LikeWidget
          liked={trait.liked}
          likesCount={trait.likesCount}
          traitId={trait.id}
        />
      </CardFooter>
    </Card>
  );
};
