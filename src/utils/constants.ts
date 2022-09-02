import { ReactComponent as PartHead } from "../assets/nouns-nouns-part-head-sharp.svg";
import { ReactComponent as PartBody } from "../assets/nouns-nouns-part-body-sharp.svg";
import { ReactComponent as PartGlasses } from "../assets/nouns-noggles-sharp.svg";
import { ReactComponent as PartAccessory } from "../assets/nouns-txt-noun-sharp.svg";
import { ReactComponent as PartBackground } from "../assets/nouns-nouns-part-background.svg";
import { FC, SVGProps } from "react";

export type NounPart = "body" | "accessory" | "glasses" | "head" | "background";

export type NounPartMapping<T> = {
  [key in NounPart]: T;
};

export const nounParts = ["background", "body", "accessory", "head", "glasses"] as NounPart[];

export const nounPartIcon = {
  background: PartBackground,
  body: PartBody,
  accessory: PartAccessory,
  head: PartHead,
  glasses: PartGlasses,
} as NounPartMapping<FC<SVGProps<SVGSVGElement>>>;

export const nounPartName = {
  background: "Background",
  body: "Body",
  accessory: "Accessory",
  head: "Head",
  glasses: "Noggles",
} as NounPartMapping<string>;

export const checkerboardBg = {
  bgSize: "3.125% 3.125%",
  bgGradient: "repeating-conic(gray.500 0% 25%, gray.400 0% 50%)",
};

export enum MouseButton {
  Left,
  Middle,
  Right,
}

export enum MouseEventType {
  Up = "mouseup",
  Down = "mousedown",
  Move = "mousemove",
}
