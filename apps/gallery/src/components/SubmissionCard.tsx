"use client";

import { formatSubmissionType } from "@/utils/traits/format";
import { SubmissionType, SubmissionCategory } from "@/types/submission";

import { FC, HTMLAttributes, ReactNode, useState } from "react";
import { SubmissionIcon } from "./SubmissionIcon";
import { cn } from "@nextui-org/react";

export interface SubmissionCardProps extends HTMLAttributes<HTMLDivElement> {
  name: ReactNode;
  type: SubmissionType | SubmissionCategory;
  image: ReactNode;
  previewImage: ReactNode;
  footer?: ReactNode;
  version?: number;
}

export const SubmissionCard: FC<SubmissionCardProps> = ({
  name,
  type,
  image,
  previewImage,
  version,
  footer,
  className,
  ...props
}) => {
  const [seeThrough, setSeeThrough] = useState(false);

  return (
    <div
      className={cn(
        "p-4 xs:p-6 w-fit h-fit flex-shrink-0 shadow-md bg-content1",
        className,
      )}
      {...props}
    >
      <div className="p-0 pb-1 flex-row flex justify-between w-full items-start gap-0 rounded-none">
        <div className="flex flex-col items-start ">
          <h1 className="font-Inter text-secondary font-bold text-2xl">
            {name}
          </h1>
          {version && (
            <small className="text-default-300 text-tiny xs:text-medium uppercase font-bold tracking-wider">
              {version === 1 ? "OG" : `v${version}`}
            </small>
          )}
        </div>

        <div className="flex flex-col items-end">
          <SubmissionIcon
            onMouseEnter={
              type !== "nouns" && type != "noun"
                ? () => setSeeThrough(true)
                : undefined
            }
            onMouseLeave={
              type !== "nouns" && type != "noun"
                ? () => setSeeThrough(false)
                : undefined
            }
            type={type}
            className={cn(
              "w-[24px] xs:w-[32px] text-default-300",
              type !== "nouns" && type != "noun" && "hover:text-default-200",
            )}
          />

          <small className="text-default-300 text-tiny xs:text-medium uppercase font-bold tracking-wider">
            {formatSubmissionType(type)}
          </small>
        </div>
      </div>
      <div className="overflow-visible items-center p-0 w-fit">
        <div className="grid  w-[256px]  h-[256px] xs:w-[320px] xs:h-[320px]  bg-checkerboard">
          <div className="flex overlap pixelated">{image}</div>
          <div
            className="flex overlap pixelated"
            style={{ opacity: seeThrough ? 0 : undefined }}
          >
            {previewImage}
          </div>
        </div>
      </div>
      {footer && (
        <div className="p-0 pt-1 flex items-end justify-between rounded-none">
          {footer}
        </div>
      )}
    </div>
  );
};
