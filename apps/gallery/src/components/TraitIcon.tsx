import AccessoryIcon from "@/assets/traitIcons/accessory.svg";
import BackgroundIcon from "@/assets/traitIcons/background.svg";
import BodyIcon from "@/assets/traitIcons/body.svg";
import HeadIcon from "@/assets/traitIcons/head.svg";
import NogglesIcon from "@/assets/traitIcons/noggles.svg";
import { TraitCategory, TraitType } from "noggles";
import { FC, PropsWithRef } from "react";

export interface TraitIconProps extends PropsWithRef<typeof AccessoryIcon> {
  type: TraitCategory | TraitType;
}

export const TraitIcon: FC<TraitIconProps> = ({ type, ...props }) => {
  switch (type) {
    case "accessories":
    case "accessory":
      return <AccessoryIcon {...props} />;
    case "heads":
    case "head":
      return <HeadIcon {...props} />;
    case "bodies":
    case "body":
      return <BodyIcon {...props} />;
    case "glasses":
      return <NogglesIcon {...props} />;
    case "background":
    case "backgrounds":
      return <BackgroundIcon {...props} />;
  }
};
