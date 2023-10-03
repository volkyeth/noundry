import { TraitType } from "@/types/trait";

export const formatTraitType = (type: TraitType) => {
  switch (type) {
    case "heads":
      return "head";
    case "glasses":
      return "noggles";
    case "accessories":
      return "accessory";
    case "bodies":
      return "body";
  }
};
