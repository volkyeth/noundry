import { TraitType } from "@/types/trait";
import accessoryIcon from "public/AccessoryIcon.svg";
import headIcon from "public/HeadIcon.svg";
import { FC } from "react";

export interface TraitIconProps extends React.HTMLAttributes<HTMLImageElement> {
  type: TraitType;
}

export const TraitIcon: FC<TraitIconProps> = ({ type, ...props }) => {
  switch (type) {
    case "accessories":
      return <img src={accessoryIcon.src} {...props} />;
    case "heads":
      return <img src={headIcon.src} {...props} />;
    default:
      return <></>;
  }
};
