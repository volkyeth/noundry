import {
  Box,
  CenterProps,
  HStack,
  IconProps,
  Kbd,
  SimpleGrid,
  SimpleGridProps,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { FC } from "react";
import { Panel } from "./Panel";

import { IconType } from "react-icons";
import { FaSquareFull } from "react-icons/fa";
import { MdRedo, MdUndo } from "react-icons/md";
import { useBrush } from "../../model/Brush";
import { useNounState } from "../../model/Noun";
import { useToolboxState } from "../../model/Toolbox";
import { useWorkspaceState } from "../../model/Workspace";
import { Brush } from "../../tools/Brush";
import { Bucket } from "../../tools/Bucket";
import { Ellipse } from "../../tools/Ellipse";
import { Eraser } from "../../tools/Eraser";
import { Eyedropper } from "../../tools/Eyedropper";
import { FilledEllipse } from "../../tools/FilledEllipse";
import { FilledRectangle } from "../../tools/FilledRectangle";
import { Line } from "../../tools/Line";
import { Move } from "../../tools/Move";
import { Rectangle } from "../../tools/Rectangle";
import {
  EllipticalSelection,
  RectangularSelection,
} from "../../tools/selections";
import { CheckerboardBg } from "../CheckerboardBg";
import { ReactIcon } from "../ReactIcon";

export type ToolboxProps = {};

type ColorBoxProps = {
  color: string;
  previousColor: string;
} & Omit<CenterProps, "color">;

const ColorBox: FC<ColorBoxProps> = ({ color, previousColor, ...props }) => {
  return (
    <CheckerboardBg
      patternRepetitions={4}
      w="full"
      h={"full"}
      borderWidth={1}
      borderColor={"gray.800"}
      {...props}
    >
      <HStack w="full" h="full" spacing={0} position={"relative"}>
        <Box
          bgColor={previousColor}
          borderWidth={1}
          borderRightWidth={0}
          borderColor={"gray.200"}
          w="50%"
          h="full"
        />
        <Box
          bgColor={color}
          borderWidth={1}
          borderLeftWidth={0}
          borderColor={"gray.200"}
          w="50%"
          h="full"
        />
      </HStack>
    </CheckerboardBg>
  );
};

export const Toolbox: FC<ToolboxProps> = ({}) => {
  const { tool, selectTool } = useToolboxState();
  const {
    color,
    previousColor,
    setPreviousColor,
    setColor,
    brushSize,
    setBrushSize,
  } = useBrush();

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
          {[
            Brush(),
            Eraser(),
            Rectangle(),
            FilledRectangle(),
            Ellipse(),
            FilledEllipse(),
            Line(),
            Bucket(),
            RectangularSelection(),
            Move(),
            EllipticalSelection(),
            Eyedropper(),
          ].map((t) => (
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
          <Box w={16} h={16}>
            <ColorBox
              color={color}
              previousColor={previousColor}
              cursor={"pointer"}
            />
          </Box>
        </HStack>
      </VStack>
      {mode.name === "Placing" && (
        <VStack
          justify={"center"}
          p={2}
          spacing={8}
          position={"absolute"}
          top={0}
          w={"full"}
          h={"full"}
          bg={"gray.700"}
        >
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

const Tool: FC<ToolProps> = ({
  isActive = false,
  isDisabled = false,
  w = "36px",
  h = "36px",
  name,
  icon,
  action,
  ...props
}) => (
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
