import { TraitType, TraitCategory, TRAIT_TYPES, IMAGE_TRAIT_TYPES } from "noggles";

// Submission types include both trait types and complete submissions like "noun"
export type SubmissionType = TraitType | "noun";

export type SubmissionCategory = TraitCategory | "nouns";

// Extended constants that include submission types
export const SUBMISSION_TYPES = [
    ...TRAIT_TYPES,
    "noun",
] as SubmissionType[];

// Type guard to check if a string is a submission type
export const isSubmissionType = (value: string): value is SubmissionType => {
    return SUBMISSION_TYPES.includes(value as SubmissionType);
};
