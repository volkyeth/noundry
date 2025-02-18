import {
  Box,
  CenterProps,
  Grid,
  GridItem,
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
  previousColor: string;
  type: "stroke" | "fill";
} & Omit<CenterProps, "color">;

const ColorBox: FC<ColorBoxProps> = ({
  color,
  previousColor,
  type,
  ...props
}) => {
  const W = "12px";

  return (
    <CheckerboardBg
      patternRepetitions={4}
      w="full"
      h={"full"}
      borderWidth={1}
      borderColor={"gray.800"}
      clipPath={
        type === "stroke"
          ? `polygon(0% 0%, 0% 100%, ${W} 100%, ${W} ${W}, calc(100% - ${W}) ${W}, calc(100% - ${W}) calc(100% - ${W}), ${W} calc(100% - ${W}), ${W} 100%, 100% 100%, 100% 0%);`
          : undefined
      }
      style={{ clipRule: "evenodd" }}
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
        {type === "stroke" && (
          <Box
            position={"absolute"}
            top={`calc(${W} - 3px)`}
            left={`calc(${W} - 3px)`}
            w={`calc(100% - 2 * ${W} + 6px)`}
            h={`calc(100% - 2 * ${W} + 6px)`}
            bgColor={"gray.800"}
            borderWidth={1}
            borderColor={"gray.200"}
          />
        )}
      </HStack>
    </CheckerboardBg>
  );
};

export const Toolbox: FC<ToolboxProps> = ({}) => {
  const { tool, selectTool } = useToolboxState();
  const {
    strokeColor,
    fillColor,
    previousStrokeColor,
    previousFillColor,
    setPreviousFillColor,
    setPreviousStrokeColor,
    setStrokeColor,
    setFillColor,
    brushSize,
    setBrushSize,
    activeColor,
    setActiveColor,
  } = useBrush();
  const eyedropper = Eyedropper();

  const mode = useWorkspaceState((state) => state.mode);
  const showHotkeys = true;

  console.log(activeColor);

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
          <Grid
            w={16}
            h={16}
            templateRows="repeat(6, 1fr)"
            gap={0}
            templateColumns="repeat(6, 1fr)"
          >
            <GridItem
              gridArea="3 / 3 / 7 / 7"
              zIndex={activeColor === "fill" ? 20 : undefined}
            >
              <ColorBox
                type="fill"
                color={fillColor}
                previousColor={previousFillColor}
                onClick={() => setActiveColor("fill")}
                cursor={"pointer"}
              />
            </GridItem>
            <GridItem
              gridArea="1 / 1 / 5 / 5"
              zIndex={activeColor === "stroke" ? 20 : undefined}
            >
              <ColorBox
                type="stroke"
                color={strokeColor}
                previousColor={previousStrokeColor}
                onClick={() => setActiveColor("stroke")}
                cursor={"pointer"}
              />
            </GridItem>
            <GridItem gridArea="1 / 5 / 3 / 7">
              <Tool
                p={1}
                w="full"
                h="full"
                name={"Swap colors"}
                icon={CgCornerDoubleRightDown}
                action={() => {
                  setPreviousStrokeColor(fillColor);
                  setStrokeColor(fillColor);
                  setFillColor(strokeColor);
                  setPreviousFillColor(strokeColor);
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
