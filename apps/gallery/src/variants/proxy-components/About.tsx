import { About as LilNounsAbout } from "../lil-nouns/components/About";
import { About as NounsAbout } from "../nouns/components/About";

export const About = () => {
  const variant = process.env.NEXT_PUBLIC_APP_VARIANT;
  switch (variant) {
    case "nouns":
      return <NounsAbout />;
    case "lil-nouns":
      return <LilNounsAbout />;
    default:
      throw new Error(`Invalid variant: ${variant}`);
  }
};
