import AccessoryIcon from "@/assets/traitIcons/accessory.svg";
import BackgroundIcon from "@/assets/traitIcons/background.svg";
import BodyIcon from "@/assets/traitIcons/body.svg";
import NegativeHeadIcon from "@/assets/traitIcons/head-negative.svg";
import HeadIcon from "@/assets/traitIcons/head.svg";
import NegativeNogglesIcon from "@/assets/traitIcons/noggles-negative.svg";
import NogglesIcon from "@/assets/traitIcons/noggles.svg";
import NegativeNounIcon from "@/assets/traitIcons/noun-negative.svg";
import NounIcon from "@/assets/traitIcons/noun.svg";
import { SubmissionCategory, SubmissionType } from "@/types/submission";
import { TraitCategory, TraitType } from "noggles";
import { FC, HtmlHTMLAttributes } from "react";

export interface SubmissionIconProps extends HtmlHTMLAttributes<SVGSVGElement> {
  type: TraitCategory | TraitType | SubmissionType | SubmissionCategory;
  negative?: boolean;
}

export const SubmissionIcon: FC<SubmissionIconProps> = ({
  type,
  negative = false,
  ...props
}) => {
  switch (type) {
    case "accessories":
    case "accessory":
      return <AccessoryIcon {...props} />;
    case "heads":
    case "head":
      return negative ? (
        <NegativeHeadIcon {...props} />
      ) : (
        <HeadIcon {...props} />
      );
    case "bodies":
    case "body":
      return <BodyIcon {...props} />;
    case "glasses":
      return negative ? (
        <NegativeNogglesIcon {...props} />
      ) : (
        <NogglesIcon {...props} />
      );
    case "background":
    case "backgrounds":
      return <BackgroundIcon {...props} />;
    case "nouns":
      return negative ? (
        <NegativeNounIcon {...props} />
      ) : (
        <NounIcon {...props} />
      );
    default:
      throw new Error(`Unknown submission type: ${type}`);
  }
};
