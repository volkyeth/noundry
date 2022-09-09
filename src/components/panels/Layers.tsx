import { Box, HStack, VStack, BoxProps, Text, Center } from "@chakra-ui/layout";
import { ChangeEvent, Dispatch, FC, forwardRef, RefObject, SetStateAction, SVGProps, useEffect, useState } from "react";
import { Preview, PreviewProps } from "./Preview";

import { NounPart, nounPartIcon, nounPartName, nounParts } from "../../utils/constants";
import {
  Button,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuItemProps,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useBoolean,
  useDisclosure,
} from "@chakra-ui/react";
import { clearCanvas, replaceCanvas } from "../../utils/canvas";
import { Panel } from "./Panel";
import { useWorkspaceState } from "../../state/workspaceState";
import { useNounState } from "../../state/nounState";
import { BiDotsHorizontal } from "react-icons/bi";
import { FaDice, FaUserEdit } from "react-icons/fa";
import { HiEye, HiEyeOff, HiLockClosed, HiLockOpen } from "react-icons/hi";
import { GiDiceSixFacesFive, GiDiceSixFacesThree } from "react-icons/gi";
import { PixelArtCanvas } from "../PixelArtCanvas";
import { RiEraserFill, RiFolderOpenFill, RiImageFill, RiSave3Fill } from "react-icons/ri";
import { IconType } from "react-icons";
import { ExportModal } from "../ExportModal";
import { ReactIcon } from "../ReactIcon";
import { NounPartState } from "../../state/nounPartState";
import { offPalette } from "../../utils/colors";
import { colord } from "colord";
import { chunk, uniq } from "lodash";
import { ImportModal } from "../ImportModal";

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
  const { isOpen: isExportOpen, onOpen: onExportOpen, onClose: onExportClose } = useDisclosure();
  const { isOpen: isImportOpen, onOpen: onImportOpen, onClose: onImportClose } = useDisclosure();
  const partState = state[part];
  const [exportedPart, setExportedPart] = useState<NounPart>();
  const fileLoader = document.createElement("input");
  fileLoader.type = "file";
  fileLoader.accept = "image/x-png";
  fileLoader.onchange = loadFile(partState);

  return (
    <>
      <HStack
        userSelect="none"
        spacing={0}
        bgColor={active ? "gray.650" : "gray.800"}
        w="full"
        borderWidth={1}
        borderColor="transparent"
        color={active ? "gray.200" : "gray.600"}
        _hover={{
          color: "gray.100",
          borderColor: active ? "gray.700" : "gray.100",
          cursor: active ? undefined : "pointer",
        }}
      >
        <HStack h="full" px={3} borderRightWidth={1} borderColor="gray.700">
          <Icon
            color="gray.700"
            _hover={{ color: "gray.100", cursor: "pointer" }}
            onClick={(e) => {
              partState.toggleVisibility();
              e.stopPropagation();
            }}
            as={partState.visible ? HiEye : HiEyeOff}
            boxSize={4}
          />
        </HStack>

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
          <HStack color="gray.700" px={3}>
            {partState.edited ? (
              <Tooltip label="This is a custom part" hasArrow>
                <ReactIcon color="gray.500" icon={FaUserEdit} boxSize={4} />
              </Tooltip>
            ) : (
              <Tooltip openDelay={500} label="Randomize" hasArrow>
                <ReactIcon
                  icon={GiDiceSixFacesThree}
                  boxSize={4}
                  _hover={{ color: "gray.100", cursor: "pointer" }}
                  onClick={(e) => {
                    partState.randomize();
                    e.stopPropagation();
                  }}
                />
              </Tooltip>
            )}
            <Menu placement="bottom-start">
              <MenuButton
                onClick={(e) => e.stopPropagation()}
                borderRadius="full"
                boxSize={4}
                minW={4}
                as={IconButton}
                aria-label="Options"
                icon={<Icon boxSize={4} as={BiDotsHorizontal} />}
                variant="ghost"
                _active={{ bgColor: "transparent", color: "white" }}
              />
              <MenuList color="gray.600" bgColor="gray.800" borderColor="gray.700" borderRadius={0}>
                {partState.edited && (
                  <ActionMenuItem icon={GiDiceSixFacesThree} onClick={partState.randomize}>
                    Randomize
                  </ActionMenuItem>
                )}
                <ActionMenuItem icon={RiEraserFill} onClick={partState.clear}>
                  Clear
                </ActionMenuItem>
                <ActionMenuItem
                  icon={RiFolderOpenFill}
                  onClick={() => {
                    onImportOpen();
                  }}
                >
                  Load
                </ActionMenuItem>
                <ActionMenuItem
                  icon={RiSave3Fill}
                  onClick={() => {
                    setExportedPart(part);
                    onExportOpen();
                  }}
                >
                  Export
                </ActionMenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </HStack>
      </HStack>
      <ExportModal part={exportedPart} isOpen={isExportOpen} onClose={onExportClose} />
      <ImportModal part={part} isOpen={isImportOpen} onClose={onImportClose} />
    </>
  );
};

type ActionMenuItemProps = {
  icon: IconType;
} & Omit<MenuItemProps, "icon">;

const ActionMenuItem: FC<ActionMenuItemProps> = ({ children, icon, ...props }) => (
  <MenuItem {...props} _hover={{ bgColor: "gray.700", color: "gray.100" }} icon={<Icon as={icon} boxSize={4} />}>
    {children}
  </MenuItem>
);

const loadFile = (partState: NounPartState) => (e: Event) => {
  console.log(e);
  const file = (e.target as HTMLInputElement).files![0];
  const reader = new FileReader();

  reader.onload = () => {
    console.log(reader.readyState);
    if (reader.readyState !== FileReader.DONE) {
      return;
    }

    console.log("loading");
    console.log(reader.result);

    const canvas = partState.canvas;

    var img = new Image();
    img.onload = () => {
      // console.log("image loaded");
      // clearCanvas(canvas);
      // const ctx = canvas.getContext("2d")!;
      // ctx.imageSmoothingEnabled = false;
      // ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      // const imageDataAsHex = chunk(imageData.data, 4).map(([r, g, b, a]) => colord({ r, g, b, a: Math.floor(a / 255) }).toHex());
      // const palette = uniq(imageDataAsHex);
      // console.log(palette);
      // const offPaletteColors = palette.map(colord).filter(offPalette);
      // if (offPaletteColors.length === 0) {
      //   console.log("some colors are out of palette");
      //   const substitutes = offPaletteColors.reduce(
      //     (substitutes, color) => ({
      //       ...substitutes,
      //       [color.toHex()]: getClosestPaletteColor(color).toHex(),
      //     }),
      //     {} as { [key: string]: string }
      //   );
      //   console.log({ substitutes });
      //   const colorsToSubstitute = Object.keys(substitutes);
      //   console.log(imageDataAsHex);
      //   const adjustedImageData = imageDataAsHex
      //     .map((color) => (colorsToSubstitute.includes(color) ? substitutes[color] : color))
      //     .map(colord)
      //     .map((color) => color.toRgb())
      //     .flatMap(({ r, g, b, a }) => [r, g, b, a === 1 ? 255 : 0]);
      //   console.log(adjustedImageData);
      //   const updatedImageData = ctx.createImageData(canvas.width, canvas.height);
      //   updatedImageData.data.set(Uint8ClampedArray.from(adjustedImageData));
      //   ctx.putImageData(updatedImageData, 0, 0);
      // }
      // partState.commit();
    };

    img.src = reader.result as string;
  };

  reader.readAsDataURL(file);
};
