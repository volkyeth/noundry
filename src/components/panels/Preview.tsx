import { AspectRatio, Box, Center, HStack, Icon, IconButton, IconButtonProps, Image, Tooltip, useBoolean, useDisclosure } from "@chakra-ui/react";
import { ImageData, getNounData, getRandomNounSeed } from "@nouns/assets";
import { buildSVG, ChainId, EncodedImage, getContractsForChainOrThrow } from "@nouns/sdk";
import { FC, RefObject, SVGProps, useEffect, useRef, useState } from "react";
import { RiImageFill, RiSave3Fill } from "react-icons/ri";
import { useNounState } from "../../state/nounState";
import { Color } from "../../tools/tools";
import { checkerboardBg, NounPart, NounPartMapping, nounParts } from "../../utils/constants";
import { ExportModal } from "../ExportModal";
import { PixelArtCanvas } from "../PixelArtCanvas";
import { Panel } from "./Panel";
import type { Modifier } from "@popperjs/core";
import { GiDiceSixFacesThree } from "react-icons/gi";
import { IconType } from "react-icons";
import { ReactComponent as LoadingNoun } from "@/assets/nouns-loading-sharp.svg";
import { getDefaultProvider, BigNumber } from "ethers";
import loadingNoun from "@/assets/loading-noun.gif";

export type PreviewProps = {};

export const Preview: FC<PreviewProps> = ({}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nounState = useNounState();
  const [canvasSize, setCanvasSize] = useState(256);
  const { isOpen: isExportOpen, onOpen: onExportOpen, onClose: onExportClose } = useDisclosure();
  const [nounLoading, setNounLoading] = useBoolean(false);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const container = containerRef.current;

    container.onresize = (e) => {
      setCanvasSize(Math.floor(container.clientWidth - (container.clientWidth % 32)));
    };

    return () => {
      container.onresize = null;
    };
  }, [containerRef]);

  containerRef.current?.onresize;

  return (
    <>
      <Panel title="Preview" spacing={0}>
        <Center objectFit="none" ref={containerRef} w="full" sx={{ aspectRatio: "1" }} bgColor="gray.800">
          <Box w={`${canvasSize}px`} h={`${canvasSize}px`} position="relative" {...checkerboardBg}>
            <PixelArtCanvas
              style={{ position: "absolute", visibility: nounLoading ? "hidden" : undefined }}
              width={canvasSize}
              height={canvasSize}
              id="preview"
              ref={nounState.canvasRef}
            />
            {nounLoading && (
              <Box bgColor="#d5d7e1ff" w="full" h="full">
                <Image position="absolute" src={loadingNoun} w="full" h="full" />
              </Box>
            )}
          </Box>
        </Center>
        <HStack color="gray.800" w="full" justifyContent="end" spacing={0}>
          <NounActionButton label="Randomize" icon={GiDiceSixFacesThree} onClick={nounState.randomize} disabled={nounLoading} />
          <NounActionButton
            label="Load auction Noun"
            icon={LoadingNoun}
            onClick={() => {
              loadLatestNoun(setNounLoading);
            }}
            disabled={nounLoading}
          />
          <NounActionButton label="Export" icon={RiSave3Fill} onClick={onExportOpen} disabled={nounLoading} />
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

const NounActionButton: FC<NounActionButtonProps> = ({ label, icon, ...buttonProps }) => (
  <Tooltip label={label} hasArrow>
    <IconButton
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
);

const loadLatestNoun = async ({ on: startLoading, off: endLoading }: { on: () => void; off: () => void }) => {
  const { nounsTokenContract } = getContractsForChainOrThrow(ChainId.Mainnet, getDefaultProvider());
  startLoading();
  return nounsTokenContract
    .totalSupply()
    .then((totalSupply) => nounsTokenContract.seeds(BigNumber.from(totalSupply).sub(1)))
    .then(async (seed) => {
      const { accessory, background, body, glasses, head } = seed;
      await useNounState.getState().loadSeed({ accessory, background, body, glasses, head });
    })
    .then(endLoading);
};
