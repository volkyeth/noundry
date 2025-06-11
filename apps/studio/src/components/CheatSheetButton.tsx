import {
  Button,
  Divider,
  HStack,
  Heading,
  Kbd,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Fragment, useMemo } from "react";
import { create } from "zustand";
import { EditMode } from "../model/WorkspaceModes/EditMode";
import { useKeybindPresetState } from "../model/KeybindPresets";
import { PlacingMode } from "../model/WorkspaceModes/PlacingMode";
import { KeybindPresetSelector } from "./KeybindPresetSelector";

export type CheatSheetState = {
  isOpen: boolean;
  toggle: () => void;
};

export const useCheatSheetState = create<CheatSheetState>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export const CheatSheetButton = () => {
  const { isOpen, toggle } = useCheatSheetState();
  const { activePreset } = useKeybindPresetState();

  const modes = [EditMode, PlacingMode];

  // Force re-computation of keybindings when preset changes
  const modalContent = useMemo(() => {
    return modes.map((mode, modeIndex) => (
      <VStack key={`${mode.name}-${activePreset}`} spacing={4} align="stretch">
        <Heading size="md" color="gray.300">
          {mode.name} Mode
        </Heading>
        <SimpleGrid
          columnGap={8}
          rowGap={6}
          templateColumns={"auto 1fr auto 1fr"}
          alignItems={"center"}
        >
          {mode.keyBindings.map(({ commands, description }, i) => (
            <Fragment key={`${mode.name}-${activePreset}-keybind-${i}`}>
              <VStack alignItems={"end"}>
                {commands.map((command, j) => (
                  <Kbd key={`${mode.name}-${activePreset}-command-${i}-${j}`}>
                    {command.toUpperCase()}
                  </Kbd>
                ))}
              </VStack>
              <Text fontSize={"xs"} padding={"auto 0"} textAlign={"start"}>
                {description}
              </Text>
            </Fragment>
          ))}
        </SimpleGrid>
        {modeIndex < modes.length - 1 && <Divider />}
      </VStack>
    ));
  }, [activePreset]);

  return (
    <>
      <Button variant={"link"} isActive={isOpen} onClick={toggle}>
        <Kbd>KEYBINDS</Kbd>
      </Button>
      <Modal isOpen={isOpen} onClose={toggle} size={"6xl"}>
        <ModalOverlay />
        <ModalContent maxH={"80vh"} overflowY={"scroll"}>
          <ModalCloseButton />
          <ModalHeader>
            <HStack
              justifyContent="space-between"
              alignItems="center"
              marginRight={8}
            >
              <Text>Key Bindings</Text>
              <KeybindPresetSelector />
            </HStack>
          </ModalHeader>
          <ModalBody p={10}>
            <VStack spacing={8} align="stretch">
              {modalContent}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
