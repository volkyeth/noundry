import {
  Box,
  BoxProps,
  Button,
  Flex,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import { Colord, colord } from "colord";
import { FC, useCallback, useEffect, useState } from "react";
import { ColorService, Hue, Saturation, useColor } from "react-color-palette";
import "react-color-palette/css";
import { useBrush } from "../../model/Brush";
import { useNounState } from "../../model/Noun";
import { useToolboxState } from "../../model/Toolbox";
import { getPalette } from "../../utils/canvas/getPalette";
import { checkerboardBg } from "../../utils/checkerboardBg";
import { getClosestPaletteColors, sortedPalette } from "../../utils/colors";
import { Panel } from "./Panel";

const ColorBox: FC<
  BoxProps & {
    colorHex: string;
    isSelected?: boolean;
    onMouseDown?: () => void;
    onMouseEnter?: () => void;
    onMouseUp?: () => void;
  }
> = ({
  colorHex,
  isSelected,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  ...props
}) => {
  const bgProps =
    colorHex === "#00000000" ? checkerboardBg(1) : { bg: colorHex };

  return (
    <Box
      w="full"
      h="10px"
      cursor="pointer"
      border={isSelected ? "2px solid white" : "none"}
      position="relative"
      _hover={{
        transform: "scale(1.5)",
        zIndex: 20,
      }}
      _after={
        isSelected
          ? {
              content: '""',
              position: "absolute",
              top: "0",
              left: "0",
              right: "0",
              bottom: "0",
              border: "1px solid black",
              pointerEvents: "none",
            }
          : undefined
      }
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseUp={onMouseUp}
      {...bgProps}
      {...props}
    />
  );
};

export const Palette = () => {
  const { color, setColor, setPreviousColor } = useBrush((state) => ({
    color: state.color,
    setColor: state.setColor,
    setPreviousColor: state.setPreviousColor,
  }));

  const { legacyPaletteMode, toggleLegacyPaletteMode } = useToolboxState(
    (state) => ({
      legacyPaletteMode: state.legacyPaletteMode,
      toggleLegacyPaletteMode: state.toggleLegacyPaletteMode,
    })
  );

  const activePartState = useNounState((state) => state[state.activePart!]);

  // Use react-color-palette's useColor hook
  const [pickerColor, setPickerColor] = useColor("#000000");
  const [layerColors, setLayerColors] = useState<string[]>(["#00000000"]);
  const [closestColors, setClosestColors] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [lastSelectedColor, setLastSelectedColor] = useState<string | null>(
    null
  );

  const getClosestPaletteColor = (color: string) => {
    const closestColor = getClosestPaletteColors(colord(color), 1)[0];
    return closestColor.toHex();
  };

  // Update closest colors whenever pickerColor changes
  useEffect(() => {
    if (!color) return;
    const closest = getClosestPaletteColors(colord(color), 8);
    setClosestColors(closest.map((c) => c.toHex()));
  }, [pickerColor]);

  const handleSaturationChange = (newColor: any) => {
    // Keep the picker color smooth
    setPickerColor(newColor);
    // But snap the actual selected color and fg color
    const closestHex = getClosestPaletteColor(newColor.hex);
    setColor(closestHex);
  };

  const handleSaturationChangeComplete = (newColor: any) => {
    const closestHex = getClosestPaletteColor(newColor.hex);
    setPreviousColor(closestHex);
    setPickerColor(ColorService.convert("hex", closestHex));
  };

  const handleHueChange = (newColor: any) => {
    setPickerColor(newColor);
  };

  const handleColorSelect = (colorHex: string) => {
    if (colorHex === "#00000000") {
      setPickerColor({
        hex: colorHex,
        rgb: { r: 0, g: 0, b: 0, a: 0 },
        hsv: { h: 0, s: 0, v: 0, a: 0 },
      });
    } else {
      const c = colord(colorHex);
      const rgb = c.toRgb();
      const hsv = c.toHsv();
      setPickerColor({ hex: colorHex, rgb, hsv });
    }
    setColor(colorHex);
    setPreviousColor(colorHex);
  };

  // Legacy mode drag handlers
  const handleColorMouseDown = useCallback(
    (colorHex: string) => {
      setIsDragging(true);
      setLastSelectedColor(colorHex);

      // Update current color but not previous color
      if (colorHex === "#00000000") {
        setPickerColor({
          hex: colorHex,
          rgb: { r: 0, g: 0, b: 0, a: 0 },
          hsv: { h: 0, s: 0, v: 0, a: 0 },
        });
      } else {
        const c = colord(colorHex);
        const rgb = c.toRgb();
        const hsv = c.toHsv();
        setPickerColor({ hex: colorHex, rgb, hsv });
      }
      setColor(colorHex);
    },
    [setColor, setPickerColor]
  );

  const handleColorMouseEnter = useCallback(
    (colorHex: string) => {
      if (!isDragging) return;
      setLastSelectedColor(colorHex);

      // Only update current color during drag
      if (colorHex === "#00000000") {
        setPickerColor({
          hex: colorHex,
          rgb: { r: 0, g: 0, b: 0, a: 0 },
          hsv: { h: 0, s: 0, v: 0, a: 0 },
        });
      } else {
        const c = colord(colorHex);
        const rgb = c.toRgb();
        const hsv = c.toHsv();
        setPickerColor({ hex: colorHex, rgb, hsv });
      }
      setColor(colorHex);
    },
    [isDragging, setColor, setPickerColor]
  );

  const handleColorMouseUp = useCallback(() => {
    if (isDragging && lastSelectedColor) {
      // Now update the previous color when mouse is released
      setPreviousColor(lastSelectedColor);
    }
    setIsDragging(false);
  }, [isDragging, lastSelectedColor, setPreviousColor]);

  // Add global mouse up handler to catch mouse releases outside the palette
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging && lastSelectedColor) {
        setPreviousColor(lastSelectedColor);
        setIsDragging(false);
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, lastSelectedColor, setPreviousColor]);

  // Update layer colors whenever the active part's canvas changes
  useEffect(() => {
    if (!activePartState?.canvas) return;
    const uniqueColors = getPalette(activePartState.canvas);

    // Convert colors to hex and deduplicate
    const hexColors = Array.from(
      new Set(
        uniqueColors
          .filter((c: Colord) => !c.isEqual(colord("#00000000")))
          .map((c: Colord) => c.toHex())
      )
    );

    // Ensure transparent is first, followed by unique colors
    setLayerColors(["#00000000", ...hexColors]);
  }, [activePartState]);

  return (
    <Panel title={"Palette"} flexGrow={1}>
      <VStack spacing={0} w="full">
        {/* Legacy mode toggle */}
        <Flex w="full" justifyContent="flex-end" mb={1} mt={-2}>
          <Button
            color="gray.600"
            id="legacy-mode"
            size="sm"
            fontWeight={"normal"}
            fontSize={7}
            variant={"link"}
            onClick={toggleLegacyPaletteMode}
          >
            {legacyPaletteMode ? "PICKER" : "GRID"}
          </Button>
        </Flex>

        {legacyPaletteMode ? (
          /* Legacy mode: Grid of all palette colors */
          <VStack spacing={1} w="full" align="stretch">
            <SimpleGrid columns={14} w="full" spacing="1px">
              {/* All palette colors */}
              {sortedPalette().map((colorHex, i) => (
                <ColorBox
                  colorHex={colorHex}
                  isSelected={colorHex === color}
                  onMouseDown={() => handleColorMouseDown(colorHex)}
                  onMouseEnter={() => handleColorMouseEnter(colorHex)}
                  onMouseUp={handleColorMouseUp}
                  key={`palette-color-${i}`}
                />
              ))}
            </SimpleGrid>
          </VStack>
        ) : (
          /* Modern mode: HSL color picker */
          <>
            <Saturation
              height={120}
              color={pickerColor}
              onChange={handleSaturationChange}
              onChangeComplete={handleSaturationChangeComplete}
            />

            {/* Closest colors row */}
            <SimpleGrid columns={8} w="full" spacing="1px">
              {closestColors.map((colorHex, i) => (
                <ColorBox
                  h={"18px"}
                  colorHex={colorHex}
                  isSelected={colorHex === color}
                  onClick={() => handleColorSelect(colorHex)}
                  key={`closest-color-${i}`}
                />
              ))}
            </SimpleGrid>

            <Hue color={pickerColor} onChange={handleHueChange} />
          </>
        )}

        {/* Layer colors - shown in both modes */}
        <Box w="full" pt="10px">
          <SimpleGrid columns={8} w="full" spacing="1px">
            {layerColors
              .filter((_, index) => index < 16)
              .map((colorHex, i) => (
                <ColorBox
                  isSelected={colorHex === color}
                  colorHex={colorHex}
                  h="18px"
                  onClick={() => handleColorSelect(colorHex)}
                  _hover={{
                    transform: "scale(1.2)",
                    zIndex: 20,
                  }}
                  key={`layer-color-${i}`}
                />
              ))}
          </SimpleGrid>
        </Box>
      </VStack>
    </Panel>
  );
};
