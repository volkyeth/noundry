import { uniq } from "lodash";
import { getPixels } from "./getPixels";

export const getPalette = (canvas: HTMLCanvasElement) => uniq(getPixels(canvas));
