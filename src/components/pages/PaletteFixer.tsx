import { Box, Center, CenterProps, Heading, HStack, Image, Input, Text, VStack } from "@chakra-ui/react";
import { useSize } from "@chakra-ui/react-use-size";
import { Dispatch, FC, ReactEventHandler, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Header } from "../layout/Header";
import { useDropzone } from "react-dropzone";
import { checkerboardBg } from "../../utils/constants";
import {
  applyColorSubstitutions,
  ColorSubstitutionCandidates,
  ColorSubstitutions,
  getColorSubstitutionCandidates,
  getPixels,
  setImageDataFromPixels,
} from "../../utils/colors";
import { PixelArtCanvas } from "../PixelArtCanvas";
import { clearCanvas, useOffscreenCanvas } from "../../utils/canvas";
import { ReactIcon } from "../ReactIcon";
import { HiArrowCircleRight } from "react-icons/hi";
import { PartImporter } from "../PartImporter";

export const PaletteFixer = () => {
  return (
    <VStack bgColor="gray.900" color="gray.100" h="100vh" minW="100vw" spacing={10}>
      <Header />
      <Text as="h1" fontSize={24}>
        Palette Fixer
      </Text>
      <PartImporter
        finishText="Download"
        finishAction={(canvas: HTMLCanvasElement) => {
          const link = document.createElement("a");
          link.download = `noundry-studio-palette-fixer`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        }}
        canFinishIfPaletteConforms={false}
      />
    </VStack>
  );
};
