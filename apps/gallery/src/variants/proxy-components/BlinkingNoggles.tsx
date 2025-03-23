import { BlinkingNoggles as LilNounsBlinkingNoggles } from "@/variants/lil-nouns/components/BlinkingNoggles";
import { BlinkingNoggles as NounsBlinkingNoggles } from "@/variants/nouns/components/BlinkingNoggles";
import { FC, SVGProps } from "react";

export const BlinkingNoggles: FC<SVGProps<SVGElement>> = (props) => {
  const variant = process.env.NEXT_PUBLIC_APP_VARIANT;
  switch (variant) {
    case "nouns":
      return <NounsBlinkingNoggles {...props} />;
    case "lil-nouns":
      return <LilNounsBlinkingNoggles {...props} />;
    default:
      throw new Error(`Invalid variant: ${variant}`);
  }
};
