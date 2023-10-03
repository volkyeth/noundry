import { TraitType } from "@/types/trait";
import AccessoryIcon from "public/AccessoryIcon.svg";
import HeadIcon from "public/HeadIcon.svg";
import { FC } from "react";

export interface TraitIconProps extends React.HTMLAttributes<SVGElement> {
  type: TraitType;
}

export const TraitIcon: FC<TraitIconProps> = ({ type, ...props }) => {
  switch (type) {
    case "accessories":
      return <AccessoryIcon {...props} />;
    case "heads":
      return <HeadIcon {...props} />;
    default:
      return <></>;
  }
};
