import { HexColor } from "noggles";
import {
  HTMLAttributes,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";

export interface TraitPaletteProps extends HTMLAttributes<HTMLCanvasElement> {
  colors: HexColor[];
  bgColor?: string;
  padding?: number;
  gap?: number;
  tilesPerRow?: number;
  tileSize?: number;
}

export const TraitPalette = forwardRef<HTMLCanvasElement, TraitPaletteProps>(
  (
    {
      colors,
      bgColor = "#d5d7e1",
      padding = 8,
      gap = 6,
      tilesPerRow = 10,
      tileSize = 24,
      className,
      ...props
    },
    ref
  ) => {
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => canvas as HTMLCanvasElement, [canvas]);

    useEffect(() => {
      if (!canvas) return;

      const width = tilesPerRow * (tileSize + gap) - gap + padding * 2;
      const height =
        Math.ceil(colors.length / tilesPerRow) * (tileSize + gap) -
        gap +
        padding * 2;

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      colors.forEach((color, i) => {
        const x = padding + (i % tilesPerRow) * (tileSize + gap);
        const y = Math.floor(i / tilesPerRow) * (tileSize + gap) + padding;

        ctx.fillStyle = color;
        ctx.fillRect(x, y, tileSize, tileSize);
      });
    }, [canvas, colors]);

    return (
      <canvas
        ref={setCanvas}
        className={twMerge("pixelated w-fit h-fit", className)}
        {...props}
      />
    );
  }
);

TraitPalette.displayName = "TraitPalette";
