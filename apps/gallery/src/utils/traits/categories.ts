import { TraitCategory, TraitType } from "noggles";
import { SubmissionType, SubmissionCategory } from "@/types/submission";

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

export const submissionCategory = (type: SubmissionType): SubmissionCategory => {
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
    case "noun":
      return "nouns";
  }
};
