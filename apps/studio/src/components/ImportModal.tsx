import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { useNounState } from "../model/Noun";
import { NounPartType } from "../types/noun";
import { replaceCanvas } from "../utils/canvas/replaceCanvas";
import { PartImporter } from "./PartImporter";

export type ImportModalProps = {
  part: NounPartType;
} & Omit<ModalProps, "children">;

export const ImportModal: FC<ImportModalProps> = ({
  part,
  onClose,
  ...props
}) => {
  const partState = useNounState((state) => state[part]);

  return (
    <Modal {...props} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent
        m={20}
        maxH={"80%"}
        color="gray.100"
        bgColor="gray.800"
        borderRadius={0}
        overflow={"scroll"}
      >
        <ModalHeader fontSize={16}>{`Import ${part}`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <PartImporter
            canFinishIfPaletteConforms={true}
            finishText="Import"
            finishAction={(canvas) => {
              replaceCanvas(canvas, partState.canvas);
              partState.commit();
              onClose();
            }}
          />
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" borderRadius={0} onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Hook
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [updated, setUpdated] = useState(false);
  useEffect(() => {
    setUpdated(true);
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setUpdated(false);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return [debouncedValue, updated];
};
