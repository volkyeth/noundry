import {
  Box,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { buildSVG } from "@nouns/sdk";
import { FC, useEffect, useState } from "react";
import { NounPartState } from "../model/NounPart";
import { NounPartType } from "../types/noun";
import { ImageData } from "../utils/assetImports";
import { nounPartName } from "../utils/constants";

interface PartSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  part: NounPartType;
  partState: NounPartState;
}

interface PartPreview {
  preview: string;
  name: string;
  index: number;
}

export const PartSelectionDialog: FC<PartSelectionDialogProps> = ({
  isOpen,
  onClose,
  part,
  partState,
}) => {
  const [partPreviews, setPartPreviews] = useState<PartPreview[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const generatePreviews = async () => {
      const { bgcolors, images, palette } = ImageData;
      let previews: PartPreview[] = [];

      if (part === "background") {
        // For backgrounds, create color swatches
        previews = bgcolors.map((color, index) => ({
          preview: `#${color}`,
          name: `Background ${index}`,
          index,
        }));
      } else {
        // For other parts, generate SVG previews
        const partImages = {
          head: images.heads,
          body: images.bodies,
          accessory: images.accessories,
          glasses: images.glasses,
        }[part];

        previews = partImages.map((partImage, index) => {
          const svgString = buildSVG([partImage], palette, "00000000");
          // Format the filename to be more readable
          const name = partImage.filename
            .replace(`${part}-`, "")
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          return {
            preview: `data:image/svg+xml;base64,${btoa(svgString)}`,
            name,
            index,
          };
        });
      }

      setPartPreviews(previews);
    };

    generatePreviews();
  }, [isOpen, part]);

  const handlePartSelect = async (index: number) => {
    await partState.loadPart(index);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent
        m={20}
        maxH={"80vh"}
        color="gray.100"
        bgColor="gray.800"
        borderRadius={0}
        overflow={"auto"}
      >
        <ModalHeader
          fontSize={16}
        >{`Select ${nounPartName[part]}`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid
            columns={part === "background" ? 8 : 4}
            spacing={4}
            pb={4}
          >
            {partPreviews.map((item) => (
              <Box
                key={`${part}-${item.index}`}
                onClick={() => handlePartSelect(item.index)}
                cursor="pointer"
                borderWidth={1}
                borderColor="gray.700"
                _hover={{ borderColor: "gray.500" }}
                p={2}
                bg="gray.900"
              >
                {part === "background" ? (
                  <Flex
                    alignItems="center"
                    justifyContent="center"
                    h="100px"
                    bg={item.preview}
                  ></Flex>
                ) : (
                  <Flex
                    alignItems="center"
                    justifyContent="center"
                    direction="column"
                    h="100%"
                  >
                    <Image src={item.preview} alt={item.name} boxSize="100px" />
                    <Text
                      mt={2}
                      textAlign="center"
                      fontSize={"12px"}
                      title={item.name}
                    >
                      {item.name}
                    </Text>
                  </Flex>
                )}
              </Box>
            ))}
          </SimpleGrid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
