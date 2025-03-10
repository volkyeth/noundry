import loadingNoun from "@/assets/loading-noun.gif";
import LoadingNoun from "@/assets/nouns-loading-sharp.svg?react";
import {
  Box,
  Button,
  Center,
  forwardRef,
  HStack,
  Icon,
  IconButton,
  IconButtonProps,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  useBoolean,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { FC, SVGProps, useEffect, useRef, useState } from "react";
import { IconType } from "react-icons";
import { GiDiceSixFacesThree } from "react-icons/gi";
import { RiSave3Fill } from "react-icons/ri";
import { appConfig } from "../../config";
import { useNounState } from "../../model/Noun";
import { useWorkspaceState } from "../../model/Workspace";
import { publicClient } from "../../services/publicClient";
import { checkerboardBg } from "../../utils/constants";
import { ExportModal } from "../ExportModal";
import { PixelArtCanvas } from "../PixelArtCanvas";
import { Panel } from "./Panel";

export type PreviewProps = {};

export const Preview: FC<PreviewProps> = ({}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const setRandomizeAllHovered = useWorkspaceState(
    (state) => state.setRandomizeAllHovered
  );
  const nounState = useNounState();
  const [canvasSize, setCanvasSize] = useState(256);
  const {
    isOpen: isExportOpen,
    onOpen: onExportOpen,
    onClose: onExportClose,
  } = useDisclosure();
  const [nounLoading, setNounLoading] = useBoolean(false);
  const nounIdInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const container = containerRef.current;

    container.onresize = (e) => {
      setCanvasSize(
        Math.floor(container.clientWidth - (container.clientWidth % 32))
      );
    };

    return () => {
      container.onresize = null;
    };
  }, [containerRef]);

  containerRef.current?.onresize;

  return (
    <>
      <Panel title="Preview" spacing={0}>
        <Center
          objectFit="none"
          ref={containerRef}
          w="full"
          sx={{ aspectRatio: "1" }}
          bgColor="gray.800"
        >
          <Box
            w={`${canvasSize}px`}
            h={`${canvasSize}px`}
            position="relative"
            {...checkerboardBg}
          >
            <PixelArtCanvas
              style={{
                position: "absolute",
                visibility: nounLoading ? "hidden" : undefined,
              }}
              width={canvasSize}
              height={canvasSize}
              id="preview"
              ref={nounState.canvasRef}
            />
            {nounLoading && (
              <Box bgColor="#d5d7e1ff" w="full" h="full">
                <Image
                  position="absolute"
                  src={loadingNoun}
                  w="full"
                  h="full"
                />
              </Box>
            )}
          </Box>
        </Center>
        <HStack color="gray.800" w="full" justifyContent="end" spacing={0}>
          <NounActionButton
            label="Randomize"
            icon={GiDiceSixFacesThree}
            onClick={nounState.randomize}
            onMouseEnter={() => setRandomizeAllHovered(true)}
            onMouseLeave={() => setRandomizeAllHovered(false)}
            disabled={nounLoading}
          />
          <Popover>
            <PopoverTrigger>
              <NounActionButton
                label={`Load ${appConfig.nounTerm}`}
                icon={LoadingNoun}
                disabled={nounLoading}
              />
            </PopoverTrigger>
            <PopoverContent w={"xs"} p={2}>
              <PopoverArrow />
              <PopoverBody fontSize={"sm"}>
                <VStack w={"full"} alignItems={"start"}>
                  <Button
                    borderRadius={0}
                    w={"full"}
                    fontSize={"xs"}
                    disabled={nounLoading}
                    onClick={async () => {
                      setNounLoading.on();
                      try {
                        await loadAuctionNoun();
                      } finally {
                        setNounLoading.off();
                      }
                    }}
                  >
                    {`Load Auction ${appConfig.nounTerm}`}
                  </Button>
                  <HStack w={"full"}>
                    <Button
                      borderRadius={0}
                      fontSize={"xs"}
                      flexGrow={1}
                      disabled={nounLoading}
                      onClick={async () => {
                        setNounLoading.on();
                        try {
                          await loadNoun(nounIdInputRef!.current!.value);
                        } finally {
                          setNounLoading.off();
                        }
                      }}
                    >
                      {`Load ${appConfig.nounTerm} #`}
                    </Button>
                    <NumberInput
                      isDisabled={nounLoading}
                      defaultValue={0}
                      min={0}
                      w={32}
                      borderRadius={0}
                    >
                      <NumberInputField
                        ref={nounIdInputRef}
                        maxLength={4}
                        borderRadius={0}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </HStack>
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <NounActionButton
            label="Export"
            icon={RiSave3Fill}
            onClick={onExportOpen}
            disabled={nounLoading}
          />
        </HStack>
      </Panel>
      <ExportModal isOpen={isExportOpen} onClose={onExportClose} />
    </>
  );
};

type NounActionButtonProps = {
  label: string;
  icon: IconType | FC<SVGProps<SVGSVGElement>>;
} & Omit<IconButtonProps, "icon" | "aria-label">;

const NounActionButton = forwardRef<NounActionButtonProps, "button">(
  ({ label, icon, ...buttonProps }, ref) => (
    <Tooltip label={label} hasArrow>
      <IconButton
        ref={ref}
        size="sm"
        borderRadius={0}
        bgColor="transparent"
        _hover={{
          bgColor: "gray.600",
          color: "gray.400",
        }}
        {...buttonProps}
        aria-label={label}
        icon={<Icon as={icon} boxSize={6} />}
      />
    </Tooltip>
  )
);

const loadAuctionNoun = async (): Promise<void> => {
  try {
    if (!appConfig.fetchLatestNounId) return;

    const latestId = await appConfig.fetchLatestNounId(publicClient);
    if (latestId !== undefined) {
      await loadNoun(latestId.toString());
    }
  } catch (error) {
    console.error("Error loading auction noun:", error);
  }
};

const loadNoun = async (nounId: string): Promise<void> => {
  try {
    const id = parseInt(nounId);
    if (isNaN(id) || !appConfig.fetchNounSeed) return;

    const seed = await appConfig.fetchNounSeed(publicClient, id);

    await useNounState.getState().loadSeed({
      accessory: seed.accessory,
      background: seed.background,
      body: seed.body,
      glasses: seed.glasses,
      head: seed.head,
    });
  } catch (error) {
    console.error("Error loading noun:", error);
  }
};
