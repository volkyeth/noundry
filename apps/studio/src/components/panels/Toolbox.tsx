import { Box, CenterProps, Grid, GridItem, HStack, IconProps, Kbd, SimpleGrid, SimpleGridProps, Text, Tooltip, VStack } from "@chakra-ui/react";
import { FC } from "react";
import { Panel } from "./Panel";

import { IconType } from "react-icons";
import { CgCornerDoubleRightDown } from "react-icons/cg";
import { FaSquareFull } from "react-icons/fa";
import { MdRedo, MdUndo } from "react-icons/md";
import { useBrush } from "../../model/Brush";
import { useNounState } from "../../model/Noun";
import { tools, useToolboxState } from "../../model/Toolbox";
import { useWorkspaceState } from "../../model/Workspace";
import { Eyedropper } from "../../tools/tools";
import { CheckerboardBg } from "../CheckerboardBg";
import { ReactIcon } from "../ReactIcon";

export type ToolboxProps = {};

type ColorBoxProps = {
  color: string;
} & Omit<CenterProps, "color">;

const ColorBox: FC<ColorBoxProps> = ({ color, ...props }) => {
  return (
    <CheckerboardBg patternRepetitions={4} w="full" h={"full"} borderWidth={1} borderColor={"gray.800"} {...props}>
      <Box bgColor={color} borderWidth={1} borderColor={"white"} w="full" h="full" />
    </CheckerboardBg>
  );
};

export const Toolbox: FC<ToolboxProps> = ({}) => {
  const { tool, selectTool } = useToolboxState();
  const { fgColor, bgColor, setFgColor, setBgColor, brushSize, setBrushSize } = useBrush();
  const eyedropper = Eyedropper();

  const mode = useWorkspaceState((state) => state.mode);
  const showHotkeys = true;

  return (
    <Panel title="Toolbox" position={"relative"}>
      <VStack>
        <HStack>
          {[1, 2, 3, 4, 5, 6].map((size) => (
            <Tool
              key={`brush-size-${size}`}
              icon={FaSquareFull}
              name={`Brush size: ${size}`}
              action={() => setBrushSize(size)}
              boxSize={size + 1}
              isActive={size === brushSize}
            />
          ))}
        </HStack>
        <SimpleGrid columns={2} spacing={4}>
          {tools.map((t) => (
            <Tool
              key={t.name}
              name={t.name}
              icon={t.icon}
              action={() => {
                selectTool(t);
              }}
              isActive={t.name === tool.name}
            />
          ))}
        </SimpleGrid>
        <HistoryNavigation />
        <HStack alignItems={"end"}>
          <Grid w={16} h={16} templateRows="repeat(6, 1fr)" gap={0} templateColumns="repeat(6, 1fr)">
            <GridItem gridArea="3 / 3 / 7 / 7">
              <ColorBox color={bgColor} />
            </GridItem>
            <GridItem gridArea="1 / 1 / 5 / 5">
              <ColorBox color={fgColor} />
            </GridItem>
            <GridItem gridArea="1 / 5 / 3 / 7">
              <Tool
                p={1}
                w="full"
                h="full"
                name={"Swap colors"}
                icon={CgCornerDoubleRightDown}
                action={() => {
                  setFgColor(bgColor);
                  setBgColor(fgColor);
                }}
              />
            </GridItem>
          </Grid>

          <Tool
            name={eyedropper.name}
            icon={eyedropper.icon}
            action={() => {
              selectTool(eyedropper);
            }}
            isActive={eyedropper.name === tool.name}
          />
        </HStack>
      </VStack>
      {mode.name === "Placing" && (
        <VStack justify={"center"} p={2} spacing={8} position={"absolute"} top={0} w={"full"} h={"full"} bg={"gray.700"}>
          <Text>Drag to position</Text>
          <VStack>
            <Kbd>Enter</Kbd>
            <Text>to place</Text>
          </VStack>

          <VStack>
            <Kbd>Escape</Kbd>
            <Text>to cancel</Text>
          </VStack>
        </VStack>
      )}
    </Panel>
  );
};

type HistoryNavigationProps = {} & SimpleGridProps;

const HistoryNavigation: FC<HistoryNavigationProps> = ({ ...props }) => {
  const { activePart, ...partsState } = useNounState();

  return (
    <SimpleGrid columns={2} spacing={4} {...props}>
      <Tool
        name="Undo"
        icon={MdUndo}
        isDisabled={!activePart || !partsState[activePart].canUndo}
        action={activePart ? partsState[activePart]?.undo : () => {}}
      />
      <Tool
        name="Redo"
        icon={MdRedo}
        isDisabled={!activePart || !partsState[activePart].canRedo}
        action={activePart ? partsState[activePart]?.redo : () => {}}
      />
    </SimpleGrid>
  );
};

type ToolProps = {
  name: string;
  icon: IconType;
  action: () => void;
  shortcuts?: string[];
  isActive?: boolean;
  isDisabled?: boolean;
} & IconProps;

const Tool: FC<ToolProps> = ({ isActive = false, isDisabled = false, w = "36px", h = "36px", name, icon, action, ...props }) => (
  <Tooltip label={name} openDelay={500}>
    <ReactIcon
      w={w}
      h={h}
      {...props}
      color={isActive ? "white" : isDisabled ? "gray.600" : "gray.500"}
      _hover={{
        color: isDisabled ? "" : "gray.100",
      }}
      onClick={isDisabled ? undefined : action}
      icon={icon}
    />
  </Tooltip>
);
