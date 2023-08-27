import { chakra, HTMLChakraProps, keyframes } from "@chakra-ui/react";
import { FC } from "react";
import { useSelection } from "../model/Selection";
import { useToolboxState } from "../model/Toolbox";
import { Move } from "../tools/tools";

export type SelectionOverlayProps = {} & HTMLChakraProps<"svg">;

export const SelectionOverlay: FC<SelectionOverlayProps> = (props) => {
  const selectedPoints = useSelection((state) => state.selectedPoints);
  const isMoveTool = useToolboxState((state) => state.tool.name === Move.name);
  if (selectedPoints.length === 0) {
    return <></>;
  }

  const d = selectedPoints.map((point) => `M${point.x} ${point.y} h1 v1 h-1 z`).join(" ");

  return (
    <chakra.svg
      viewBox="0 0 32 32"
      width="full"
      height="full"
      strokeWidth={2}
      pointerEvents={"none"}
      _hover={{
        cursor: isMoveTool ? "move" : undefined,
      }}
      overflow={"visible"}
      {...props}
    >
      <mask id="fillMask">
        <rect x="0" y="0" width="100%" height="100%" fill="white" />
        <chakra.path d={d} fill="black" />
      </mask>
      <chakra.path d={d} fill="none" stroke={"white"} vectorEffect={"non-scaling-stroke"} mask={"url(#fillMask)"} pointerEvents={"fill"} />
      <chakra.path
        d={d}
        fill="none"
        stroke={"black"}
        animation={`${blackMarquee} 0.3s linear infinite`}
        strokeDasharray={2}
        vectorEffect={"non-scaling-stroke"}
        mask={"url(#fillMask)"}
      />
    </chakra.svg>
  );
};

const blackMarquee = keyframes`
  from {
    stroke-dashoffset: 0;
} to { stroke-dashoffset: 4; }`;
