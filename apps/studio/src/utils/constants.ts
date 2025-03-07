import { FC, SVGProps } from "react";
import PartGlasses from "../assets/nouns-noggles-sharp.svg?react";
import PartBackground from "../assets/nouns-nouns-part-background.svg?react";
import PartBody from "../assets/nouns-nouns-part-body-sharp.svg?react";
import PartHead from "../assets/nouns-nouns-part-head-sharp.svg?react";
import PartAccessory from "../assets/nouns-txt-noun-sharp.svg?react";
import { NounPartMapping, NounPartType } from "../types/noun";

export const nounParts = ["background", "body", "accessory", "head", "glasses"] as NounPartType[];

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
