import { chakra, HTMLChakraProps, keyframes } from "@chakra-ui/react";
import { FC, useRef } from "react";
import { useToolboxState } from "../model/Toolbox";
import { usePlacingState } from "../model/WorkspaceModes/PlacingMode";
import { Move } from "../tools/tools";
import { getBoundingRect } from "../utils/canvas";
import { getPaintedPixels } from "../utils/canvas/getPaintedPixels";

export type PlacingOverlayProps = {} & HTMLChakraProps<"svg">;

export const PlacingOverlay: FC<PlacingOverlayProps> = (props) => {
  const { placingCanvas, placeOffset } = usePlacingState();
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasWidth = svgRef.current?.getBoundingClientRect().width ?? 0;
  const pixelSize = canvasWidth / 32;
  const pixels = placingCanvas ? getPaintedPixels(placingCanvas) : [];
  const isMoveTool = useToolboxState((state) => state.tool.name === Move.name);
  if (pixels.length === 0) {
    return <></>;
  }
  const { x, y, width, height } = getBoundingRect(pixels);

  return (
    <chakra.svg
      ref={svgRef}
      viewBox="0 0 32 32"
      width="full"
      height="full"
      strokeWidth={2}
      pointerEvents={"fill"}
      transform={`translate(${placeOffset.x * pixelSize}px, ${placeOffset.y * pixelSize}px)`}
      animation={`${marquee} 0.3s linear infinite`}
      {...props}
    >
      <rect x={x} y={y} width={width + 1} height={height + 1} vectorEffect={"non-scaling-stroke"} fill="none" stroke={"cyan"} strokeDasharray={2} />
    </chakra.svg>
  );
};

const marquee = keyframes`
  from {
    stroke-dashoffset: 0;
} to { stroke-dashoffset: 4; }`;
