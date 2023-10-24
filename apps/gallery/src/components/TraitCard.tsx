"use client";

import { formatTraitType } from "@/utils/traits/format";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";

import { TraitCategory, TraitType } from "noggles";
import { FC, ReactNode, useState } from "react";
import { TraitIcon } from "./TraitIcon";

export interface TraitCardProps {
  name: ReactNode;
  type: TraitType | TraitCategory;
  image: ReactNode;
  previewImage: ReactNode;
  footer?: ReactNode;
}

export const TraitCard: FC<TraitCardProps> = ({
  name,
  type,
  image,
  previewImage,
  footer,
}) => {
  const [seeThrough, setSeeThrough] = useState(false);

  return (
    <Card className="p-4 xs:p-6 rounded-none shadow-none w-fit h-fit flex-shrink-0">
      <CardHeader className="p-0 pb-1 flex-row flex justify-between w-full items-start gap-0 rounded-none">
        <div className="flex flex-col items-start ">
          <h1 className="font-Inter text-secondary font-bold text-2xl">
            {name}
          </h1>
          <small className="text-default-300 text-tiny xs:text-medium uppercase font-bold tracking-wider">
            {formatTraitType(type)}
          </small>
        </div>

        <TraitIcon
          onMouseEnter={() => setSeeThrough(true)}
          onMouseLeave={() => setSeeThrough(false)}
          type={type}
          className="w-[24px] xs:w-[32px] text-default-300 hover:text-default-200"
        />
      </CardHeader>
      <CardBody className="overflow-visible items-center p-0 w-fit">
        <div className="grid  w-[256px]  h-[256px] xs:w-[320px] xs:h-[320px] bg-checkerboard">
          <div className="flex row-start-1 row-end-1 col-start-1 col-end-1 pixelated">
            {image}
          </div>
          <div
            className="flex row-start-1 row-end-1 col-start-1 col-end-1 pixelated"
            style={{ opacity: seeThrough ? 0 : undefined }}
          >
            {previewImage}
          </div>
        </div>
      </CardBody>
      {footer && (
        <CardFooter className="p-0 pt-1 flex items-end justify-between rounded-none">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};
