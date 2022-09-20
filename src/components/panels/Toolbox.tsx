import { Box, Center, CenterProps, Grid, GridItem, HStack, Icon, IconProps, SimpleGrid, SimpleGridProps, Tooltip, VStack } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { Panel } from "./Panel";

import { MdRedo, MdUndo } from "react-icons/md";
import { IconType } from "react-icons";
import { Bucket, Ellipse, Eraser, Eyedropper, Line, Pen, Rectangle } from "../../tools/tools";
import { useToolboxState } from "../../state/toolboxState";
import { Workspace } from "../layout/Workspace";
import { useWorkspaceState } from "../../state/workspaceState";
import { NounPart } from "../../utils/constants";
import { useNounState } from "../../state/nounState";
import { FaSquareFull } from "react-icons/fa";
import { CheckerboardBg } from "../CheckerboardBg";
import { ReactIcon } from "../ReactIcon";
import { CgCornerDoubleRightDown, TbReplace } from "react-icons/all";

export type ToolboxProps = {};

type ColorBoxProps = {
  color: string;
} & Omit<CenterProps, "color">;

const ColorBox: FC<ColorBoxProps> = ({ color, ...props }) => {
  return (
    <CheckerboardBg cells={4} w="full" h={"full"} borderWidth={1} borderColor={"gray.800"} {...props}>
      <Box bgColor={color} borderWidth={1} borderColor={"white"} w="full" h="full" />
    </CheckerboardBg>
  );
};

export const Toolbox: FC<ToolboxProps> = ({}) => {
  const toolboxState = useToolboxState();
  const { fgColor, bgColor, setFgColor, setBgColor } = toolboxState;
  const eyedropper = Eyedropper();

  return (
    <Panel title="Toolbox">
      <VStack>
        <HStack>
          {[1, 2, 3, 4, 5, 6].map((brushSize) => (
            <Tool
              icon={FaSquareFull}
              name={`Brush size: ${brushSize}`}
              action={() => toolboxState.setBrushSize(brushSize)}
              boxSize={brushSize + 1}
              isActive={toolboxState.brushSize === brushSize}
            />
          ))}
        </HStack>
        <SimpleGrid columns={2} spacing={4}>
          {[Pen(), Eraser(), Line(), Rectangle(), Ellipse(), Bucket()].map((tool) => (
            <Tool
              key={tool.name}
              name={tool.name}
              icon={tool.icon}
              action={() => {
                toolboxState.selectTool(tool);
              }}
              isActive={tool.name === toolboxState.tool.name}
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
            {/*<GridItem gridArea="5 / 1 / 7 / 3"></GridItem>*/}
          </Grid>

          <Tool
            name={eyedropper.name}
            icon={eyedropper.icon}
            action={() => {
              toolboxState.selectTool(eyedropper);
            }}
            isActive={eyedropper.name === toolboxState.tool.name}
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
    <SimpleGrid columns={2} spacing={4}>
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
