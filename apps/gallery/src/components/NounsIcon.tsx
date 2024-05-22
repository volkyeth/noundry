import NegativeNounsIconImage from "@/assets/traitIcons/nouns-negative.svg";
import NounsIconImage from "@/assets/traitIcons/nouns.svg";
import { FC, HtmlHTMLAttributes } from "react";

export interface NounsIconProps extends HtmlHTMLAttributes<SVGSVGElement> {
  negative?: boolean;
}

export const NounsIcon: FC<NounsIconProps> = ({
  negative = false,
  ...props
}) => {
  return negative ? (
    <NegativeNounsIconImage {...props} />
  ) : (
    <NounsIconImage {...props} />
  );
};
