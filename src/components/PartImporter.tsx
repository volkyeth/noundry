import {
  applyColorSubstitutions,
  ColorSubstitutionCandidates,
  ColorSubstitutions,
  getColorSubstitutionCandidates,
  getPixels,
  setImageDataFromPixels,
} from "../utils/colors";
import { Box, Button, ButtonProps, Center, CenterProps, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { useSize } from "@chakra-ui/react-use-size";
import { Dispatch, FC, ReactEventHandler, Ref, RefObject, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { HiArrowCircleRight } from "react-icons/hi";
import { clearCanvas, replaceCanvas, useCanvasInitializer, useOffscreenCanvas } from "../utils/canvas";
import { checkerboardBg } from "../utils/constants";
import { PixelArtCanvas } from "./PixelArtCanvas";
import { ReactIcon } from "./ReactIcon";

export type PartImporterProps = {
  canFinishIfPaletteConforms: boolean;
} & Omit<FinishButtonProps, "canvas">;

export const PartImporter: FC<PartImporterProps> = ({ canFinishIfPaletteConforms, ...finishButtonProps }) => {
  const tmpCanvas = useOffscreenCanvas();
  const { canvas: originalCanvas, canvasRef: originalCanvasRef } = useCanvasInitializer((canvas) => {
    replaceCanvas(tmpCanvas, canvas);
  });

  const { canvas: outputCanvas, canvasRef: outputCanvasRef } = useCanvasInitializer((canvas) => {
    if (!colorSubstitutions) return;
    setImageDataFromPixels(canvas, applyColorSubstitutions(getPixels(tmpCanvas), colorSubstitutions));
  });

  const [colorSubstitutionCandidates, setColorSubstitutionCandidates] = useState<ColorSubstitutionCandidates>();
  const [colorSubstitutions, setColorSubstitutions] = useState<ColorSubstitutions>();
  const hasPartLoaded = colorSubstitutionCandidates !== undefined && colorSubstitutions !== undefined;
  const hasSubstitutions = hasPartLoaded && !empty(colorSubstitutionCandidates) && !empty(colorSubstitutions);
  const conformsToPalette = colorSubstitutionCandidates && !hasSubstitutions;

  useEffect(() => {
    if (!outputCanvas || !colorSubstitutions) return;
    setImageDataFromPixels(outputCanvas, applyColorSubstitutions(getPixels(tmpCanvas), colorSubstitutions));
  }, [colorSubstitutions]);

  return (
    <VStack h="full" w="full" fontSize={14} spacing={0} justifyContent="space-around">
      {hasPartLoaded && (
        <HStack justifyContent="space-around" alignItems="start" spacing={8}>
          <VStack bgColor="gray.800" p={2}>
            <Center w={64} h={64} {...checkerboardBg}>
              <PixelArtCanvas style={{ width: "100%", height: "100%" }} ref={originalCanvasRef} />
            </Center>
            {conformsToPalette ? (
              <Text color="green.300" w={64}>
                This image conforms to the classic nouns palette!
              </Text>
            ) : (
              <Text color="red.300" w={64}>
                This image has off-palette colors!
              </Text>
            )}
            {conformsToPalette && canFinishIfPaletteConforms && <FinishButton {...finishButtonProps} canvas={originalCanvas!} />}
          </VStack>
          {hasSubstitutions && (
            <>
              <VStack>
                <Text>{`There are ${Object.keys(colorSubstitutions).length} off-palette colors`}</Text>
                <Text>Pick the replacement colors:</Text>
                <SubstituteColorPicker
                  candidates={colorSubstitutionCandidates}
                  substitutions={colorSubstitutions}
                  setSubstitutions={setColorSubstitutions}
                />
              </VStack>
              <VStack bgColor="gray.800" p={2}>
                <Box boxSize={64} {...checkerboardBg}>
                  <PixelArtCanvas style={{ width: "100%", height: "100%" }} ref={outputCanvasRef} />
                </Box>
                <FinishButton {...finishButtonProps} canvas={outputCanvas!} />
              </VStack>
            </>
          )}
        </HStack>
      )}
      <Dropzone
        maxW={96}
        p={4}
        h={32}
        hasPartLoaded={hasPartLoaded}
        onPartLoaded={(image: HTMLImageElement) => {
          clearCanvas(tmpCanvas);
          tmpCanvas.getContext("2d")!.drawImage(image, 0, 0);
          const substitutionCandidates = getColorSubstitutionCandidates(tmpCanvas, 5);
          setColorSubstitutionCandidates(substitutionCandidates);
          const substitutions = Object.entries(substitutionCandidates).reduce(
            (substitutions, [offPaletteColor, candidates]) => ({
              ...substitutions,
              [offPaletteColor]: candidates[0],
            }),
            {} as ColorSubstitutions
          );
          setColorSubstitutions(substitutions);
          if (!originalCanvas) return;

          replaceCanvas(tmpCanvas, originalCanvas);
        }}
      />
    </VStack>
  );
};

type FinishButtonProps = {
  finishText: string;
  finishAction: (canvas: HTMLCanvasElement) => void;
  canvas: HTMLCanvasElement;
};

const FinishButton: FC<FinishButtonProps> = ({ finishText, finishAction, canvas }) => (
  <Button colorScheme="blue" borderRadius={0} mr={3} onClick={() => finishAction(canvas)}>
    {finishText}
  </Button>
);

type SubstituteColorPickerProps = {
  candidates: ColorSubstitutionCandidates;
  substitutions: ColorSubstitutions;
  setSubstitutions: Dispatch<SetStateAction<ColorSubstitutions | undefined>>;
};

const SubstituteColorPicker: FC<SubstituteColorPickerProps> = ({ candidates, substitutions, setSubstitutions }) => (
  <VStack spacing={0}>
    {Object.entries(candidates).map(([offPaletteColor, substitutionCandidates], i) => (
      <HStack key={`color-picker-${i}`}>
        <Box boxSize={4} bgColor={offPaletteColor} />
        <ReactIcon icon={HiArrowCircleRight} />
        <HStack>
          {substitutionCandidates.map((candidate, j) => (
            <Box
              key={`substitute-color-${i}-${j}`}
              boxSize={4}
              bgColor={candidate}
              borderWidth={2}
              borderColor={substitutions[offPaletteColor] === candidate ? "white" : "transparent"}
              _hover={{ borderColor: "gray.100" }}
              onClick={() => {
                setSubstitutions({
                  ...substitutions,
                  [offPaletteColor]: candidate,
                });
              }}
            />
          ))}
        </HStack>
      </HStack>
    ))}
  </VStack>
);

type DropzoneProps = {
  onPartLoaded: (img: HTMLImageElement) => void;
  hasPartLoaded: boolean;
} & CenterProps;

const Dropzone: FC<DropzoneProps> = ({ onPartLoaded, hasPartLoaded, ...props }) => {
  const onDrop = useCallback((files: File[]) => {
    const reader = new FileReader();
    reader.onload = function () {
      const img = new Image();
      img.onload = () => {
        onPartLoaded(img);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(files[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Center bgColor="gray.850" px={2} {...getRootProps()} {...props} cursor="pointer" _hover={{ color: "white" }}>
      <Input {...getInputProps()} size="0" type="file" accept="image/x-png" />
      <p>
        {isDragActive
          ? "Drop the part here"
          : hasPartLoaded
          ? "Drop another part here, or click to select a file"
          : "Drop your part here, or click to select a file"}
      </p>
    </Center>
  );
};

const empty = (o: object) => Object.keys(o).length === 0;
