import { TraitCategory } from "@/types/trait";
import AccessoryIcon from "public/AccessoryIcon.svg";
import HeadIcon from "public/HeadIcon.svg";
import { FC, PropsWithRef } from "react";

export interface TraitIconProps extends PropsWithRef<typeof AccessoryIcon> {
  type: TraitCategory;
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
