import { chunk } from "remeda";
import { parseHex } from "./parseHex.js";

export const rleDecode = (encoded: string) =>
  chunk(
    (encoded.match(/.{1,2}/g)! ?? []).map((hex) => parseHex(hex)),
    2
  ).flatMap(([count, colorIndex]) => new Array(count).fill(colorIndex));
