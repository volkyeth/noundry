import { TraitCategory, TraitType } from "noggles";

export const traitCategory = (type: TraitType): TraitCategory => {
  switch (type) {
    case "background":
      return "backgrounds";
    case "body":
      return "bodies";
    case "glasses":
      return "glasses";
    case "head":
      return "heads";
    case "accessory":
      return "accessories";
  }
};
