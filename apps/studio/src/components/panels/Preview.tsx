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
import { useQuery } from "@tanstack/react-query";
import { FC, SVGProps, useEffect, useRef, useState } from "react";
import { IconType } from "react-icons";
import { GiDiceSixFacesThree } from "react-icons/gi";
import { RiSave3Fill } from "react-icons/ri";
import { appConfig } from "../../config";
import { useNounState } from "../../model/Noun";
import { useWorkspaceState } from "../../model/Workspace";
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
  const { data: auctionNounId } = useQuery({
    queryKey: ["auctionNounId"],
    queryFn: async () => {
      if (!appConfig.subgraphUri) return null;
      return fetch(appConfig.subgraphUri, {
        body: '{"query":"{\\n  auctions(orderDirection: desc, orderBy: startTime, first : 1) {\\n    noun {\\n      id\\n    }\\n  }\\n}","variables":null}',
        method: "POST",
      })
        .then((r) => r.json())
        .then((r) => parseInt(r!.data!.auctions[0]!.noun!.id));
    },

    refetchInterval: 12_000,
  });

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
          {appConfig.subgraphUri && (
            <Popover>
              <PopoverTrigger>
                <NounActionButton
                  label="Load Noun"
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
                      disabled={!auctionNounId || nounLoading}
                      onClick={() => {
                        setNounLoading.on();
                        loadNoun(auctionNounId!.toString()).finally(() =>
                          setNounLoading.off()
                        );
                      }}
                    >
                      Load Auction Noun
                    </Button>
                    <HStack w={"full"}>
                      <Button
                        borderRadius={0}
                        fontSize={"xs"}
                        flexGrow={1}
                        disabled={!auctionNounId || nounLoading}
                        onClick={() => {
                          setNounLoading.on();
                          loadNoun(nounIdInputRef!.current!.value).finally(() =>
                            setNounLoading.off()
                          );
                        }}
                      >
                        Load Noun #
                      </Button>
                      <NumberInput
                        isDisabled={!auctionNounId || nounLoading}
                        defaultValue={0}
                        min={0}
                        max={auctionNounId ?? undefined}
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
          )}
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

const loadNoun = async (nounId: string) => {
  if (!appConfig.subgraphUri) return;
  return fetch(appConfig.subgraphUri, {
    body: `{"query":"{\\n  seed(id: \\"${nounId}\\") {\\n    background,\\n    body,\\n    accessory,\\n    head,\\n    glasses\\n  }\\n}","variables":null}`,
    method: "POST",
  })
    .then(
      (r) =>
        r.json() as Promise<{
          data: {
            seed: {
              background: string;
              body: string;
              accessory: string;
              head: string;
              glasses: string;
            };
          };
        }>
    )
    .then(
      async ({
        data: {
          seed: { accessory, background, body, glasses, head },
        },
      }) =>
        await useNounState.getState().loadSeed({
          accessory: parseInt(accessory),
          background: parseInt(background),
          body: parseInt(body),
          glasses: parseInt(glasses),
          head: parseInt(head),
        })
    );
};
