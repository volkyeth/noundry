import {
  HTMLAttributes,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";

export interface TraitOnCheckerboardProps
  extends HTMLAttributes<HTMLCanvasElement> {
  trait: ImageBitmap;
  size?: number;
}

export const TraitOnCheckerboard = forwardRef<
  HTMLCanvasElement,
  TraitOnCheckerboardProps
>(({ trait, size = 96, className, ...props }, ref) => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  useImperativeHandle(ref, () => canvas as HTMLCanvasElement, [canvas]);

  useEffect(() => {
    if (!canvas) return;
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;

    const checkerTileSize = size / 64;
    const tilesPerRow = size / checkerTileSize;
    for (let y = 0; y < tilesPerRow; y++) {
      for (let x = 0; x < tilesPerRow; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? "#f9fafb" : "#e5e7eb";
        ctx.fillRect(
          x * checkerTileSize,
          y * checkerTileSize,
          checkerTileSize,
          checkerTileSize
        );
      }
    }

    ctx.drawImage(trait, 0, 0, size, size);
  }, [canvas, trait, size]);

  return (
    <canvas
      ref={setCanvas}
      className={twMerge("pixelated w-fit h-fit", className)}
      {...props}
    />
  );
});

TraitOnCheckerboard.displayName = "TraitOnCheckerboard";
