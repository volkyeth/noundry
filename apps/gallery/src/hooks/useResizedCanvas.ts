"use client";

import { useLayoutEffect } from "react";

export interface UseResizedImageProps {
  input: CanvasImageSource | null;
  canvas: HTMLCanvasElement | null;
  circleCrop?: boolean;
  size: number;
}

export const useResizedImage = ({
  input,
  canvas,
  size,
  circleCrop,
}: UseResizedImageProps) => {
  useLayoutEffect(() => {
    if (!canvas) return;

    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, size, size);

    if (!input) return;

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(input, 0, 0, size, size);
    if (circleCrop) {
      ctx.globalCompositeOperation = "destination-in";
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }
  }, [input, size, canvas, circleCrop]);
};
