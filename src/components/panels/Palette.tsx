import { Box, SimpleGrid } from "@chakra-ui/react";
import { ImageData } from "@nouns/assets";
import { useToolboxState } from "../../state/toolboxState";
import { sortedPalette } from "../../utils/colors";
import { Panel } from "./Panel";

export const Palette = () => {
  const setColor = useToolboxState((state) => state.setColor);
  return (
    <Panel title={"Palette"} flexGrow={1}>
      <SimpleGrid columns={7} w="full" h="full" spacing="1px">
        {sortedPalette().map((color, i) => (
          <Box
            key={`color-${i}`}
            _hover={{
              m: -1,
              zIndex: 999,
              borderRadius: "2px",
              h: "150%",
              transitionDuration: "0.1s",
            }}
            transition="0.5s"
            // h="15px"
            bgColor={color}
            onClick={() => setColor(color)}
          />
        ))}
      </SimpleGrid>
    </Panel>
  );
};
