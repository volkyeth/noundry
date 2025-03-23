import { Trait } from "@/types/trait";
import { UserInfo } from "@/types/user";
import { FC } from "react";
import { Propose as LilNounsPropose } from "../lil-nouns/components/propose/Propose";
import { Propose as NounsPropose } from "../nouns/components/propose/Propose";

export interface ProposeProps {
  trait: Trait;
  author: UserInfo;
}

export const Propose: FC<ProposeProps> = (props) => {
  const variant = process.env.NEXT_PUBLIC_APP_VARIANT;
  switch (variant) {
    case "nouns":
      return <NounsPropose {...props} />;
    case "lil-nouns":
      return <LilNounsPropose {...props} />;
    default:
      throw new Error(`Invalid variant: ${variant}`);
  }
};
