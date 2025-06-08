import React, { useCallback } from "react";

export type PixelArtCanvasProps = React.ComponentProps<"canvas"> & {
  willReadFrequently?: boolean;
};

export const PixelArtCanvas = React.forwardRef<HTMLCanvasElement, PixelArtCanvasProps>(({ style, willReadFrequently, ...props }, ref) => {
  const canvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
    if (canvas && willReadFrequently) {
      canvas.getContext("2d", { willReadFrequently: true });
    }
    if (typeof ref === "function") {
      ref(canvas);
    } else if (ref) {
      ref.current = canvas;
    }
  }, [ref, willReadFrequently]);

  return (
    <canvas
      ref={canvasRef}
      width={32}
      height={32}
      {...props}
      style={{
        imageRendering: "pixelated",
        ...style,
      }}
    />
  );
});
