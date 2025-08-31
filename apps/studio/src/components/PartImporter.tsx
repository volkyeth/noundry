import {
  Box,
  Button,
  Center,
  CenterProps,
  HStack,
  Input,
  StackProps,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import { HiArrowCircleRight } from "react-icons/hi";
import { appConfig } from "../config";
import { useCanvasInitializer, useOffscreenCanvas } from "../utils/canvas";
import { clearCanvas } from "../utils/canvas/clearCanvas";
import { getPixels } from "../utils/canvas/getPixels";
import { replaceCanvas } from "../utils/canvas/replaceCanvas";
import {
  ColorSubstitutionCandidates,
  ColorSubstitutions,
  applyColorSubstitutions,
  getColorSubstitutionCandidates,
  setImageDataFromPixels,
} from "../utils/colors";
import { checkerboardBg } from "../utils/constants";
import { PixelArtCanvas } from "./PixelArtCanvas";
import { ReactIcon } from "./ReactIcon";

export type PartImporterProps = {
  canFinishIfPaletteConforms: boolean;
} & Omit<FinishButtonProps, "canvas">;

export const PartImporter: FC<PartImporterProps> = ({
  canFinishIfPaletteConforms,
  ...finishButtonProps
}) => {
  const tmpCanvas = useOffscreenCanvas();
  const { canvas: originalCanvas, canvasRef: originalCanvasRef } =
    useCanvasInitializer((canvas) => {
      replaceCanvas(tmpCanvas, canvas);
    });

  const { canvas: outputCanvas, canvasRef: outputCanvasRef } =
    useCanvasInitializer((canvas) => {
      if (!colorSubstitutions) return;
      setImageDataFromPixels(
        canvas,
        applyColorSubstitutions(getPixels(tmpCanvas), colorSubstitutions)
      );
    });

  const [colorSubstitutionCandidates, setColorSubstitutionCandidates] =
    useState<ColorSubstitutionCandidates>();
  const [colorSubstitutions, setColorSubstitutions] =
    useState<ColorSubstitutions>();
  const hasPartLoaded =
    colorSubstitutionCandidates !== undefined &&
    colorSubstitutions !== undefined;
  const hasSubstitutions =
    hasPartLoaded &&
    !empty(colorSubstitutionCandidates) &&
    !empty(colorSubstitutions);
  const conformsToPalette = colorSubstitutionCandidates && !hasSubstitutions;

  useEffect(() => {
    if (!outputCanvas || !colorSubstitutions) return;
    setImageDataFromPixels(
      outputCanvas,
      applyColorSubstitutions(getPixels(tmpCanvas), colorSubstitutions)
    );
  }, [colorSubstitutions]);

  return (
    <VStack
      h="full"
      w="full"
      fontSize={14}
      spacing={4}
      justifyContent="space-around"
      p={10}
    >
      {hasPartLoaded && (
        <HStack
          justifyContent="space-around"
          flexGrow={1}
          alignItems="start"
          spacing={8}
        >
          <VStack bgColor="gray.800" p={2}>
            <Center w={64} h={64} {...checkerboardBg}>
              <PixelArtCanvas
                style={{ width: "100%", height: "100%" }}
                ref={originalCanvasRef}
              />
            </Center>
            {conformsToPalette ? (
              <Text color="green.300" w={64}>
                This image conforms to the {appConfig.nounTerm}s palette!
              </Text>
            ) : (
              <Text color="red.300" w={64}>
                This image has off-palette colors!
              </Text>
            )}
            {conformsToPalette && canFinishIfPaletteConforms && (
              <FinishButton {...finishButtonProps} canvas={originalCanvas!} />
            )}
          </VStack>
          {hasSubstitutions && (
            <>
              <VStack h="full">
                <Text>{`There are ${
                  Object.keys(colorSubstitutions).length
                } off-palette colors`}</Text>
                <Text>Pick the replacement colors:</Text>
                <SubstituteColorPicker
                  candidates={colorSubstitutionCandidates}
                  substitutions={colorSubstitutions}
                  setSubstitutions={setColorSubstitutions}
                />
              </VStack>
              <VStack bgColor="gray.800" p={2}>
                <Box boxSize={64} {...checkerboardBg}>
                  <PixelArtCanvas
                    style={{ width: "100%", height: "100%" }}
                    ref={outputCanvasRef}
                  />
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
          const ctx = tmpCanvas.getContext("2d")!;
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(image, 0, 0, tmpCanvas.width, tmpCanvas.height);
          
          const substitutionCandidates = getColorSubstitutionCandidates(
            tmpCanvas,
            5
          );
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

const FinishButton: FC<FinishButtonProps> = ({
  finishText,
  finishAction,
  canvas,
}) => (
  <Button
    colorScheme="blue"
    borderRadius={0}
    mr={3}
    onClick={() => finishAction(canvas)}
  >
    {finishText}
  </Button>
);

type SubstituteColorPickerProps = {
  candidates: ColorSubstitutionCandidates;
  substitutions: ColorSubstitutions;
  setSubstitutions: Dispatch<SetStateAction<ColorSubstitutions | undefined>>;
} & StackProps;

const SubstituteColorPicker: FC<SubstituteColorPickerProps> = ({
  candidates,
  substitutions,
  setSubstitutions,
  ...props
}) => {
  return (
    <VStack spacing={2} {...props}>
      {Object.entries(candidates).map(
        ([offPaletteColor, substitutionCandidates], i) => (
          <HStack key={`color-picker-${i}`}>
            <Box boxSize={7} bgColor={offPaletteColor} borderWidth={1} />
            <ReactIcon icon={HiArrowCircleRight} />
            <HStack>
              {substitutionCandidates.map((candidate, j) => (
                <Box
                  key={`substitute-color-${i}-${j}`}
                  boxSize={7}
                  bgColor={candidate}
                  borderWidth={2}
                  borderColor={
                    substitutions[offPaletteColor] === candidate
                      ? "red"
                      : "transparent"
                  }
                  _hover={{ borderColor: "red" }}
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
        )
      )}
    </VStack>
  );
};

type DropzoneProps = {
  onPartLoaded: (img: HTMLImageElement) => void;
  hasPartLoaded: boolean;
} & CenterProps;

const Dropzone: FC<DropzoneProps> = ({
  onPartLoaded,
  hasPartLoaded,
  ...props
}) => {
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
    <Center
      bgColor="gray.850"
      px={2}
      {...getRootProps()}
      {...props}
      cursor="pointer"
      _hover={{ color: "white" }}
    >
      <Input {...getInputProps()} size="0" type="file" accept="image/x-png" />
      <p>
        {isDragActive
          ? "Drop the image here"
          : hasPartLoaded
          ? "Drop another image here to replace, or click to select a file"
          : "Drop your image here, or click to select a file"}
      </p>
    </Center>
  );
};

const empty = (o: object) => Object.keys(o).length === 0;
