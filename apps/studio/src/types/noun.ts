export type NounPartType = "body" | "accessory" | "glasses" | "head" | "background";

export type NounPartMapping<T> = {
  [key in NounPartType]: T;
};
