import { Box, SimpleGrid } from "@chakra-ui/react";
import { useBrush } from "../../model/Brush";
import { sortedPalette } from "../../utils/colors";
import { MouseButton } from "../../utils/constants";
import { CheckerboardBg } from "../CheckerboardBg";
import { Panel } from "./Panel";

export const Palette = () => {
  const { setFgColor, setBgColor } = useBrush((state) => ({ setFgColor: state.setFgColor, setBgColor: state.setBgColor }));
  return (
    <Panel title={"Palette"} flexGrow={1}>
      <SimpleGrid columns={8} w="full" h="full" spacing="1px">
        <CheckerboardBg
          {...hoverFx}
          patternRepetitions={2}
          onContextMenu={(e) => e.preventDefault()}
          onMouseUp={(e) => {
            if (e.button === MouseButton.Left) {
              setFgColor("#00000000");
            }
            if (e.button === MouseButton.Right) {
              setBgColor("#00000000");
            }
          }}
        />
        {sortedPalette().map((color, i) => (
          <Box
            key={`color-${i}`}
            {...hoverFx}
            bgColor={color}
            onContextMenu={(e) => e.preventDefault()}
            onMouseUp={(e) => {
              if (e.button === MouseButton.Left) {
                setFgColor(color);
              }
              if (e.button === MouseButton.Right) {
                setBgColor(color);
              }
              e.stopPropagation();
            }}
          />
        ))}
      </SimpleGrid>
    </Panel>
  );
};

const hoverFx = {
  _hover: {
    m: -1,
    zIndex: 999,
    borderRadius: "2px",
    h: "150%",
    transitionDuration: "0.1s",
  },
  transition: "0.5s",
};
