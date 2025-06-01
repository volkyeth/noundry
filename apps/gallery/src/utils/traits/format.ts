import { TraitCategory, TraitType } from "noggles";
import { SubmissionType, SubmissionCategory } from "@/types/submission";
import { appConfig } from "@/variants/config";

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

export const formatSubmissionType = (type?: SubmissionCategory | SubmissionType | null) => {
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
    case "nouns":
    case "noun":
      return appConfig.nounTerm.toLowerCase();
    default:
      return "";
  }
};
