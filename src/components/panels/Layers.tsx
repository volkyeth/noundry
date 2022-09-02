import { Box, HStack, VStack, BoxProps, Text, Center } from "@chakra-ui/layout";
import { Dispatch, FC, RefObject, SetStateAction, SVGProps, useEffect, useState } from "react";
import { Preview, PreviewProps } from "./Preview";

import { NounPart, nounPartIcon, nounPartName, nounParts } from "../../utils/constants";
import { Icon, useBoolean } from "@chakra-ui/react";
import { replaceCanvas } from "../../utils/canvas";
import { Panel } from "./Panel";
import { useWorkspaceState } from "../../state/workspaceState";
import { useNounState } from "../../state/nounState";
import { RiEye2Fill, RiEye2Line, RiEyeCloseLine, RiEyeFill, RiEyeLine, RiEyeOffFill, RiEyeOffLine, RiLock2Fill, RiLockFill } from "react-icons/ri";
import { HiEye, HiEyeOff, HiLockClosed, HiLockOpen } from "react-icons/hi";
import { PixelArtCanvas } from "../PixelArtCanvas";

export type NounPanelPros = {};

export const Layers: FC<NounPanelPros> = ({}) => {
  return (
    <Panel title="Parts">
      <VStack spacing="1px" w="full">
        {nounParts
          .slice()
          .reverse()
          .map((part) => (
            <PartLayer key={`${part}-layer`} part={part} PartIcon={nounPartIcon[part]} />
          ))}
      </VStack>
    </Panel>
  );
};

export type PartSelectorProps = {
  PartIcon: FC<SVGProps<SVGSVGElement>>;
  part: NounPart;
};

export const PartLayer: FC<PartSelectorProps> = ({ PartIcon, part }) => {
  const state = useNounState();
  const { activePart, activatePart } = state;
  const active = activePart === part;
  const [locked, setLocked] = useBoolean(false);
  const partState = state[part];

  return (
    <HStack
      spacing={0}
      bgColor={active ? "gray.650" : "gray.800"}
      w="full"
      borderWidth={2}
      borderColor={active ? "gray.600" : "transparent"}
      color={active ? "gray.200" : "gray.600"}
      _hover={{
        color: "gray.100",
        borderColor: "gray.100",
        cursor: active ? undefined : "pointer",
      }}
    >
      <Center onClick={partState.toggleVisibility} w="48px" h="48px" borderRightWidth={1} borderColor="gray.700">
        <Icon as={partState.visible ? HiEye : HiEyeOff} boxSize={4} />
      </Center>

      <HStack
        flexGrow={1}
        justifyContent="space-between"
        id={`selector-${part}`}
        onClick={() => {
          activatePart(part);
        }}
      >
        <PartIcon width={48} height={48} />
        <Text flexGrow={1}>{nounPartName[part].toUpperCase()}</Text>
        {/* <Center onClick={partState.toggleVisibility} w="48px" h="48px" color="gray.850">
          <Icon as={HiLockClosed} boxSize={4} onClick={partState.toggleVisibility} />
        </Center> */}
      </HStack>
    </HStack>
  );
};
