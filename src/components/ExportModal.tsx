import {
  Box,
  Button,
  Center,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FC, useEffect, useRef, useState } from "react";
import { useNounState } from "../state/nounState";
import { clearCanvas, drawCanvas, replaceCanvas } from "../utils/canvas";
import { checkerboardBg, NounPart } from "../utils/constants";
import { PixelArtCanvas } from "./PixelArtCanvas";

export type ExportModalProps = {
  part?: NounPart;
} & Omit<ModalProps, "children">;

export const ExportModal: FC<ExportModalProps> = ({ part, onClose, ...props }) => {
  const [exportCanvas, setExportCanvas] = useState<HTMLCanvasElement | null>();
  const nounState = useNounState();
  const [scale, setScale] = useState(10);
  const [debouncedScale, scaleChanged] = useDebounce(scale, 500);

  const exportedCanvas = part ? nounState[part].canvas : nounState.canvas;

  useEffect(() => {
    if (!exportedCanvas || !exportCanvas) {
      return;
    }

    drawCanvas(exportedCanvas, exportCanvas);
  }, [part, exportedCanvas, exportCanvas, debouncedScale]);
  return (
    <Modal {...props} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent h="80%" color="gray.100" bgColor="gray.800" borderRadius={0}>
        <ModalHeader fontSize={16}>{`Export ${part ?? "noun"}`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack h="full">
            <Center w="full" position="relative" flexGrow={1} overflow="hidden">
              <Center borderWidth={1} {...checkerboardBg} position="absolute" w={`${32 * scale}px`} h={`${32 * scale}px`} bgColor="transparent">
                {scaleChanged ? (
                  <Spinner size={scale > 2 ? "xl" : scale > 1 ? "md" : "sm"} />
                ) : (
                  <PixelArtCanvas
                    style={{ display: scaleChanged ? "none" : undefined }}
                    ref={setExportCanvas}
                    width={32 * debouncedScale}
                    height={32 * debouncedScale}
                  />
                )}
              </Center>
            </Center>
            <Text>{`export size: ${32 * scale}px x ${32 * scale}px (x${scale})`}</Text>
            <Slider value={scale} min={1} max={32} step={1} w="80%" onChange={setScale}>
              <SliderMark value={1} mt="1" ml="-2.5" fontSize="sm">
                x1
              </SliderMark>
              <SliderMark value={10} mt="1" ml="-2.5" fontSize="sm">
                x10
              </SliderMark>
              <SliderMark value={32} mt="1" ml="-2.5" fontSize="sm">
                x32
              </SliderMark>
              <SliderTrack borderRadius={0}>
                <Box position="relative" right={10} />
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={4} borderRadius={0} />
            </Slider>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" borderRadius={0} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            borderRadius={0}
            mr={3}
            onClick={() => {
              const link = document.createElement("a");
              link.download = `noundry-studio-${part ?? "noun"}` ?? "noundry-studio-noun";
              link.href = exportCanvas!.toDataURL("image/png");
              link.click();
            }}
          >
            Export
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
