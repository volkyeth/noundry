import { Trait } from "@/types/trait";
import { TraitType } from "noggles";

export const traitType = (trait: Trait): TraitType => {
  switch (trait.type) {
    case "heads":
      return "head";
    case "glasses":
      return "glasses";
    case "accessories":
      return "accessory";
    case "bodies":
      return "body";
    default:
      throw new Error(`Unknown trait type: ${trait.type}`);
  }
};
