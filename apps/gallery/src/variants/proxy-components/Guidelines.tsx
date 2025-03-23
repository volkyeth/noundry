import { Guidelines as LilNounsGuidelines } from "../lil-nouns/Guidelines";
import { Guidelines as NounsGuidelines } from "../nouns/Guidelines";

export const Guidelines = () => {
  const variant = process.env.NEXT_PUBLIC_APP_VARIANT;
  switch (variant) {
    case "nouns":
      return <NounsGuidelines />;
    case "lil-nouns":
      return <LilNounsGuidelines />;
    default:
      throw new Error(`Invalid variant: ${variant}`);
  }
};
