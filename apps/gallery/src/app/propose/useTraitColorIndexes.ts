"use client";

import { PngDataUri } from "@/types/image";
import { useEffect, useState } from "react";
import { getColorIndexes } from "./artworkEncoding";

export const useTraitColorIndexes = (
  trait: PngDataUri,
  palette?: string[]
): number[] | undefined => {
  const [colorIndexes, setColorIndexes] = useState<number[] | undefined>(
    undefined
  );

  useEffect(() => {
    if (!palette) {
      setColorIndexes(undefined);
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, 32, 32);
      ctx.drawImage(img, 0, 0, 32, 32);

      setColorIndexes(getColorIndexes(canvas, palette));
    };

    img.src = trait;

    return () => {
      img.onload = null;
    };
  }, [trait, palette]);

  return colorIndexes;
};
