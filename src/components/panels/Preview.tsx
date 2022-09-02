import { AspectRatio, Box, Center } from "@chakra-ui/react";
import { ImageData, getNounData, getRandomNounSeed } from "@nouns/assets";
import { buildSVG, EncodedImage } from "@nouns/sdk";
import { FC, RefObject, useEffect, useRef, useState } from "react";
import { useNounState } from "../../state/nounState";
import { Color } from "../../tools/tools";
import { checkerboardBg, NounPart, NounPartMapping, nounParts } from "../../utils/constants";
import { PixelArtCanvas } from "../PixelArtCanvas";
import { Panel } from "./Panel";

export type PreviewProps = {};

export const Preview: FC<PreviewProps> = ({}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nounState = useNounState();
  const [canvasSize, setCanvasSize] = useState(256);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const container = containerRef.current;

    container.onresize = (e) => {
      setCanvasSize(Math.floor(container.clientWidth - (container.clientWidth % 32)));
    };

    console.log(canvasSize);

    return () => {
      container.onresize = null;
    };
  }, [containerRef]);

  containerRef.current?.onresize;

  return (
    <Panel title="Preview">
      <Center objectFit="none" ref={containerRef} w="full" sx={{ aspectRatio: "1" }} bgColor="gray.800">
        <Box w={`${canvasSize}px`} h={`${canvasSize}px`} {...checkerboardBg}>
          <PixelArtCanvas width={canvasSize} height={canvasSize} id="preview" ref={nounState.canvasRef} />
        </Box>
      </Center>
    </Panel>
  );
};
