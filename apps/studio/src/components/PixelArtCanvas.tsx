import React from "react";

export const PixelArtCanvas = React.forwardRef<HTMLCanvasElement, React.ComponentProps<"canvas">>(({ style, ...props }, ref) => (
  <canvas
    ref={ref}
    width={32}
    height={32}
    {...props}
    style={{
      imageRendering: "pixelated",
      ...style,
    }}
  />
));
