import { FC, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export const Skeleton: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={twMerge("bg-default-200 animate-pulse", className)}
    {...props}
  />
);
