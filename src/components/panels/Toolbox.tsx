import { Box, CenterProps, Grid, GridItem, HStack, IconProps, SimpleGrid, SimpleGridProps, Tooltip, VStack } from "@chakra-ui/react";
import { FC } from "react";
import { Panel } from "./Panel";

import { IconType } from "react-icons";
import { CgCornerDoubleRightDown } from "react-icons/cg";
import { FaSquareFull } from "react-icons/fa";
import { MdRedo, MdUndo } from "react-icons/md";
import { useBrushState } from "../../state/brushState";
import { useNounState } from "../../state/nounState";
import { useToolboxState } from "../../state/toolboxState";
import { Bucket, CircularSelection, Ellipse, Eraser, Eyedropper, Line, Move, Pen, Rectangle, RectangularSelection } from "../../tools/tools";
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
  const { fgColor, bgColor, setFgColor, setBgColor, brushSize, setBrushSize } = useBrushState();
  const eyedropper = Eyedropper();

  return (
    <Panel title="Toolbox">
      <VStack>
        <HStack>
          {[1, 2, 3, 4, 5, 6].map((brushSize) => (
            <Tool
              key={`brush-size-${brushSize}`}
              icon={FaSquareFull}
              name={`Brush size: ${brushSize}`}
              action={() => setBrushSize(brushSize)}
              boxSize={brushSize + 1}
              isActive={brushSize === brushSize}
            />
          ))}
        </HStack>
        <SimpleGrid columns={2} spacing={4}>
          {[Pen(), Eraser(), Line(), Rectangle(), Ellipse(), Bucket(), Move(), RectangularSelection(), CircularSelection()].map((tool) => (
            <Tool
              key={tool.name}
              name={tool.name}
              icon={tool.icon}
              action={() => {
                selectTool(tool);
              }}
              isActive={tool.name === tool.name}
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
