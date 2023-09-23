import {
  Button,
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
import { Fragment } from "react";
import { create } from "zustand";
import { useWorkspaceState } from "../model/Workspace";

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

  const mode = useWorkspaceState((state) => state.mode);
  return (
    <>
      <Button variant={"link"} isActive={isOpen} onClick={toggle}>
        <Kbd>?</Kbd>
      </Button>
      <Modal isOpen={isOpen} onClose={toggle} size={"6xl"}>
        <ModalOverlay />
        <ModalContent maxH={"80vh"} overflowY={"scroll"}>
          <ModalCloseButton />
          <ModalHeader>{mode.name} Mode Key Bindings</ModalHeader>
          <ModalBody p={10}>
            <SimpleGrid
              columnGap={8}
              rowGap={6}
              templateColumns={"auto 1fr auto 1fr"}
              alignItems={"center"}
            >
              {mode.keyBindings.map(({ commands, description }, i) => (
                <Fragment key={`keybind-${i}`}>
                  <VStack alignItems={"end"}>
                    {commands.map((command, j) => (
                      <Kbd key={`command-${i}-${j}`}>
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
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
