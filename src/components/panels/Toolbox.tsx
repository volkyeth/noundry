import { Box, HStack, Icon, IconProps, SimpleGrid, SimpleGridProps, VStack } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { Panel } from "./Panel";

import { MdRedo, MdUndo } from "react-icons/md";
import { IconType } from "react-icons";
import { Eraser, Eyedropper, Pen } from "../../tools/tools";
import { useToolboxState } from "../../state/toolboxState";
import { Workspace } from "../layout/Workspace";
import { useWorkspaceState } from "../../state/workspaceState";
import { NounPart } from "../../utils/constants";
import { useNounState } from "../../state/nounState";

export type ToolboxProps = {};

export const Toolbox: FC<ToolboxProps> = ({}) => {
  const toolboxState = useToolboxState();
  const eyedropper = Eyedropper();

  return (
    <Panel title="Toolbox">
      <VStack>
        <SimpleGrid columns={2} spacing={4}>
          {[Pen(), Eraser()].map((tool) => (
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
        <HStack>
          <Box bgColor={toolboxState.color} w={10} h={10} />
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

const Tool: FC<ToolProps> = ({ isActive = false, isDisabled = false, name, icon, action, ...props }) => (
  <Icon
    {...props}
    color={isActive ? "white" : isDisabled ? "gray.600" : "gray.500"}
    _hover={{
      color: isDisabled ? "" : "gray.100",
    }}
    boxSize="36px"
    onClick={isDisabled ? undefined : action}
    as={icon}
  />
);