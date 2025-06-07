import galleryIcon from "@/assets/gallery.png";
import { HStack, Text, VStack } from "@chakra-ui/layout";
import { FC, SVGProps, useState } from "react";

import {
  Button,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuItemProps,
  MenuList,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { BiDotsHorizontal } from "react-icons/bi";
import { FaUserEdit } from "react-icons/fa";
import { GiDiceSixFacesThree } from "react-icons/gi";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { RiEraserFill, RiFolderOpenFill, RiSave3Fill } from "react-icons/ri";
import { appConfig } from "../../config";
import { useNounState } from "../../model/Noun";
import { useWorkspaceState } from "../../model/Workspace";
import { NounPartType } from "../../types/noun";
import { nounPartIcon, nounPartName, nounParts } from "../../utils/constants";
import { ExportModal } from "../ExportModal";
import { ImportModal } from "../ImportModal";
import { PartSelectionDialog } from "../PartSelectionDialog";
import { ReactIcon } from "../ReactIcon";
import { Panel } from "./Panel";

export type NounPanelPros = {};

export const Layers: FC<NounPanelPros> = ({}) => {
  return (
    <Panel title="Parts">
      <VStack spacing="1px" w="full">
        {nounParts
          .slice()
          .reverse()
          .map((part) => (
            <PartLayer
              key={`${part}-layer`}
              part={part}
              PartIcon={nounPartIcon[part]}
            />
          ))}
      </VStack>
    </Panel>
  );
};

export type PartSelectorProps = {
  PartIcon: FC<SVGProps<SVGSVGElement>>;
  part: NounPartType;
};

export const PartLayer: FC<PartSelectorProps> = ({ PartIcon, part }) => {
  const state = useNounState();
  const { activePart, activatePart, remixedFrom } = state;
  const active = activePart === part;
  const {
    isOpen: isExportOpen,
    onOpen: onExportOpen,
    onClose: onExportClose,
  } = useDisclosure();
  const {
    isOpen: isImportOpen,
    onOpen: onImportOpen,
    onClose: onImportClose,
  } = useDisclosure();
  const {
    isOpen: isPartSelectionOpen,
    onOpen: onPartSelectionOpen,
    onClose: onPartSelectionClose,
  } = useDisclosure();
  const partState = state[part];
  const [exportedPart, setExportedPart] = useState<NounPartType>();
  const randomizeAllHovered = useWorkspaceState(
    (state) => state.randomizeAllHovered
  );

  const handlePartIconClick = (e: React.MouseEvent) => {
    if (!partState.edited) {
      onPartSelectionOpen();
      e.stopPropagation();
    } else {
      activatePart(part);
    }
  };

  return (
    <>
      <HStack
        userSelect="none"
        spacing={0}
        bgColor={active ? "gray.750" : "gray.800"}
        w="full"
        borderWidth={1}
        borderColor="transparent"
        color={active ? "gray.200" : "gray.600"}
        _hover={{
          color: "gray.100",
          bgColor: active ? "gray.750" : "gray.850",
          // borderColor: active ? "gray.700" : "gray.100",
          cursor: active ? undefined : "pointer",
        }}
      >
        <HStack h="full" px={3}>
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
          <Button
            onClick={handlePartIconClick}
            isDisabled={partState.edited}
            variant="outline"
            size="sm"
            p={0}
            borderRadius="none"
            color="gray.600"
            _hover={{
              color: "gray.300",
              _disabled: { transform: "translateY(0)" },

              transform: "translateY(-1px)",
            }}
            _active={{ bg: "gray.600", transform: "translateY(0)" }}
          >
            <PartIcon width={32} height={32} />
          </Button>
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
                  color={randomizeAllHovered ? "gray.100" : undefined}
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
              <MenuList
                color="gray.600"
                bgColor="gray.800"
                borderColor="gray.700"
                borderRadius={0}
              >
                {appConfig.galleryUrl &&
                  partState.edited &&
                  part !== "background" && (
                    <MenuItem
                      as="a"
                      target="_blank"
                      href={`${
                        appConfig.galleryUrl
                      }/submit?${new URLSearchParams({
                        type: part,
                        background: `${state.background.seed ?? ""}`,
                        body: `${state.body.seed ?? ""}`,
                        head: `${state.head.seed ?? ""}`,
                        accessory: `${state.accessory.seed ?? ""}`,
                        glasses: `${state.glasses.seed ?? ""}`,
                        [part]: partState.canvas.toDataURL("image/png"),
                        ...(remixedFrom && { remixedFrom }),
                      })}`}
                      icon={<img src={galleryIcon} />}
                    >
                      Submit to Gallery
                    </MenuItem>
                  )}
                {partState.edited && (
                  <ActionMenuItem
                    icon={GiDiceSixFacesThree}
                    onClick={partState.randomize}
                  >
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
      <ExportModal
        part={exportedPart}
        isOpen={isExportOpen}
        onClose={onExportClose}
      />
      <ImportModal part={part} isOpen={isImportOpen} onClose={onImportClose} />
      <PartSelectionDialog
        part={part}
        partState={partState}
        isOpen={isPartSelectionOpen}
        onClose={onPartSelectionClose}
      />
    </>
  );
};

type ActionMenuItemProps = {
  icon?: IconType;
} & Omit<MenuItemProps, "icon">;

const ActionMenuItem: FC<ActionMenuItemProps> = ({
  children,
  icon,
  ...props
}) => (
  <MenuItem
    {...props}
    _hover={{ bgColor: "gray.700", color: "gray.100" }}
    icon={<Icon as={icon} boxSize={4} />}
  >
    {children}
  </MenuItem>
);
