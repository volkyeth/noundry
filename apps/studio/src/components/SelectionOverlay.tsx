import { chakra, HTMLChakraProps, keyframes } from "@chakra-ui/react";
import { FC } from "react";
import { useSelection } from "../model/Selection";

export type SelectionOverlayProps = {} & HTMLChakraProps<"svg">;

export const SelectionOverlay: FC<SelectionOverlayProps> = (props) => {
  const selectedPoints = useSelection((state) => state.selectedPoints);
  if (selectedPoints.length === 0) {
    return <></>;
  }

  const d = selectedPoints.map((point) => `M${point.x} ${point.y} h1 v1 h-1 z`).join(" ");

  return (
    <chakra.svg viewBox="0 0 32 32" width="calc(100% + 2px)" height="calc(100% + 2px)" strokeWidth={2} pointerEvents={"none"} overflow={"visible"} {...props}>
      <mask id="fillMask">
        <rect x="-1" y="-1" width="calc(100% + 2px)" height="calc(100% + 2px)" fill="white" />
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
