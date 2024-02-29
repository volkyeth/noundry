import { TraitCategory, TraitType } from "noggles";

export const formatTraitType = (type?: TraitCategory | TraitType | null) => {
  switch (type) {
    case "heads":
    case "head":
      return "head";
    case "glasses":
      return "noggles";
    case "accessories":
    case "accessory":
      return "accessory";
    case "bodies":
    case "body":
      return "body";
    case "backgrounds":
    case "background":
      return "background";
    default:
      return "";
  }
};
