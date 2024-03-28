import { getPixels } from "@/utils/canvas/getPixels";
import { deflateRaw } from "pako";
import { chunk } from "remeda";
import { encodeAbiParameters } from "viem";

const TRANSPARENT = 0;

export type ColorIndex = number;
export type EncodedArtwork = `0x${string}`;
export type DecodedArtwork = {
  paletteIndex: number;
  pixels: ColorIndex[];
  width: number;
  height: number;
};
export type BoundedPixels = {
  bounds: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  pixels: ColorIndex[];
};

export type EncodedCompressedParts = [
  encodedCompressedArtwork: `0x${string}`,
  originalLength: bigint,
  itemCount: number,
];

export const getPaletteDict = (palette: string[]) =>
  palette.reduce(
    (lookup, color, index) => ({
      ...lookup,
      [color.toLowerCase()]: index,
    }),
    {} as Record<string, number>
  );

export const compressAndEncodeArtwork = (
  partCanvas: HTMLCanvasElement,
  palette: string[],
  paletteIndex: number
): EncodedCompressedParts =>
  compressEncodedArtwork([
    encodeArtwork(
      partCanvas.height,
      partCanvas.width,
      getColorIndexes(partCanvas, palette),
      paletteIndex
    ),
  ]);

export const compressAndEncodeTrait = (
  traitColorIndexes: number[],
  paletteIndex: number
): EncodedCompressedParts =>
  compressEncodedArtwork([
    encodeArtwork(32, 32, traitColorIndexes, paletteIndex),
  ]);

export const getColorIndexes = (
  partCanvas: HTMLCanvasElement,
  palette: string[]
) => {
  const paletteDict = getPaletteDict(palette);
  return getPixels(partCanvas).map((color) => {
    return paletteDict[color.toHex().toLowerCase()] ?? TRANSPARENT;
  });
};

export const compressEncodedArtwork = (
  encodedArtwork: EncodedArtwork[]
): EncodedCompressedParts => {
  const abiEncodedArtwork = encodeAbiParameters(
    [{ type: "bytes[]" }],
    [encodedArtwork]
  );
  const encodedCompressedArtwork = ("0x" +
    Buffer.from(
      deflateRaw(Buffer.from(abiEncodedArtwork.substring(2), "hex"))
    ).toString("hex")) as `0x${string}`;
  const originalLength = BigInt(abiEncodedArtwork.substring(2).length / 2);
  const itemCount = encodedArtwork.length;

  return [encodedCompressedArtwork, originalLength, itemCount];
};

export const encodeArtwork = (
  height: number,
  width: number,
  pixels: number[],
  paletteIndex: number
): `0x${string}` => {
  const {
    bounds: { top, right, bottom, left },
    pixels: boundedPixels,
  } = packToBoundedPixels(pixels, width, height);
  const metadata = [paletteIndex, top, right, bottom, left].map((v) =>
    toHexByte(v)
  );
  return `0x${metadata.join("")}${rleEncode(boundedPixels)}`;
};

export const decodeArtwork = (
  encoded: EncodedArtwork,
  width: number,
  height: number
): DecodedArtwork => {
  const paletteIndex = parseHex(encoded.substring(2, 4));
  const top = parseHex(encoded.substring(4, 6));
  const right = parseHex(encoded.substring(6, 8)) - 1;
  const bottom = parseHex(encoded.substring(8, 10));
  const left = parseHex(encoded.substring(10, 12));
  const boundedPixels = rleDecode(encoded.substring(12));

  const pixels = unpackBoundedPixels(
    { pixels: boundedPixels, bounds: { top, right, bottom, left } },
    width,
    height
  );

  return {
    paletteIndex,
    width,
    height,
    pixels,
  };
};

export const packToBoundedPixels = (
  pixels: ColorIndex[],
  width: number,
  height: number
): BoundedPixels => {
  let top = height - 1;
  let right = 0;
  let bottom = 0;
  let left = width - 1;
  const rows: number[][] = new Array(height).fill(null).map(() => []);

  for (const [i, pixel] of pixels.entries()) {
    const row = Math.floor(i / width);
    const col = i % width;

    const isTransparent = pixel === TRANSPARENT;
    rows[row].push(pixel);

    if (!isTransparent) {
      top = Math.min(top, row);
      right = Math.max(right, col);
      bottom = Math.max(bottom, row);
      left = Math.min(left, col);
    }
  }

  const boundedPixels = rows
    .slice(top, bottom + 1)
    .flatMap((row) => row.slice(left, right + 1));

  // right bound is calculated to be one pixel outside the content
  right++;

  return {
    bounds: {
      top,
      right,
      bottom,
      left,
    },
    pixels: boundedPixels,
  };
};

export const unpackBoundedPixels = (
  boundedPixels: BoundedPixels,
  width: number,
  height: number
): number[] => {
  const {
    bounds: { top, right, bottom, left },
    pixels,
  } = boundedPixels;

  const emptyRow = () => new Array<number>(width).fill(TRANSPARENT);
  const leftGap = () => new Array<number>(left).fill(TRANSPARENT);
  const rightGap = () => new Array<number>(width - right - 1).fill(TRANSPARENT);
  const boundedRows = chunk(pixels, right - left + 1);
  return [
    ...new Array(top).fill(null).flatMap(() => emptyRow()),
    ...boundedRows.flatMap((boundedRow) => [
      ...leftGap(),
      ...boundedRow,
      ...rightGap(),
    ]),
    ...new Array(height - bottom - 1).fill(null).flatMap(() => emptyRow()),
  ];
};

export const rleEncode = (boundedPixels: number[]) => {
  const encoding: string[] = [];
  let previousColorIndex = boundedPixels[0];
  let colorStreakCount = 1;

  for (let i = 1; i < boundedPixels.length; i++) {
    if (boundedPixels[i] !== previousColorIndex || colorStreakCount === 255) {
      encoding.push(toHexByte(colorStreakCount), toHexByte(previousColorIndex));
      colorStreakCount = 1;
      previousColorIndex = boundedPixels[i];
    } else {
      colorStreakCount++;
    }
  }

  if (previousColorIndex !== undefined) {
    encoding.push(toHexByte(colorStreakCount), toHexByte(previousColorIndex));
  }
  return encoding.join("");
};

export const rleDecode = (encoded: string) =>
  chunk(
    encoded.match(/.{1,2}/g)!.map((hex) => parseHex(hex)),
    2
  ).flatMap(([count, colorIndex]) => new Array(count).fill(colorIndex));

export const toHexByte = (n: number): string => {
  return n.toString(16).padStart(2, "0");
};

export const parseHex = (hex: string): number => {
  return parseInt(hex, 16);
};
