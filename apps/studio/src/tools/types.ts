import { IconType } from "react-icons";
import { NounPartState } from "../model/NounPart";
import { Point } from "../types/geometry";

export type ToolAction = (points: Point[], workingCanvas: HTMLCanvasElement, partState: NounPartState) => void;

export type Tool = {
  apply: ToolAction;
  name: string;
  icon: IconType;
  shortcut?: string;
};

export type Color = string; 