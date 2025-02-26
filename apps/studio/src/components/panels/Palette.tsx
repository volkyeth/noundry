import { Box, SimpleGrid, VStack } from "@chakra-ui/react";
import { Colord, colord } from "colord";
import { useCallback, useEffect, useState } from "react";
import { ColorService, Hue, Saturation, useColor } from "react-color-palette";
import "react-color-palette/css";
import { useBrush } from "../../model/Brush";
import { useNounState } from "../../model/Noun";
import { getPalette } from "../../utils/canvas/getPalette";
import { getClosestPaletteColors } from "../../utils/colors";
import { CheckerboardBg } from "../CheckerboardBg";
import { Panel } from "./Panel";

export const Palette = () => {
  const { setColor, setPreviousColor } = useBrush((state) => ({
    setColor: state.setColor,
    setPreviousColor: state.setPreviousColor,
  }));
  const activePartState = useNounState((state) => state[state.activePart!]);

  const setCurrentColor = useCallback(
    (color: string) => {
      setColor(color);
    },
    [setColor]
  );

  const setPrevColor = useCallback(
    (color: string) => {
      setPreviousColor(color);
    },
    [setPreviousColor]
  );

  // Use react-color-palette's useColor hook
  const [pickerColor, setPickerColor] = useColor("#000000");
  const [layerColors, setLayerColors] = useState<string[]>(["#00000000"]);

  const getClosestPaletteColor = (color: string) => {
    const closestColor = getClosestPaletteColors(colord(color), 1)[0];
    return closestColor.toHex();
  };

  const handleSaturationChange = (newColor: any) => {
    // Keep the picker color smooth
    setPickerColor(newColor);
    // But snap the actual selected color and fg color
    const closestHex = getClosestPaletteColor(newColor.hex);
    setCurrentColor(closestHex);
  };

  const handleSaturationChangeComplete = (newColor: any) => {
    const closestHex = getClosestPaletteColor(newColor.hex);
    setPrevColor(closestHex);
    setPickerColor(ColorService.convert("hex", closestHex));
  };

  const handleHueChange = (newColor: any) => {
    setPickerColor(newColor);
  };

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
      <VStack spacing={4} w="full">
        <Saturation
          height={120}
          color={pickerColor}
          onChange={handleSaturationChange}
          onChangeComplete={handleSaturationChangeComplete}
        />

        <Hue color={pickerColor} onChange={handleHueChange} />

        <SimpleGrid columns={8} w="full" spacing="1px">
          {layerColors.map((colorHex, i) =>
            colorHex === "#00000000" ? (
              <CheckerboardBg
                key={`layer-color-${i}`}
                w="full"
                h="18px"
                patternRepetitions={2}
                cursor="pointer"
                onClick={() => {
                  setPickerColor({
                    hex: colorHex,
                    rgb: { r: 0, g: 0, b: 0, a: 0 },
                    hsv: { h: 0, s: 0, v: 0, a: 0 },
                  });
                  setCurrentColor(colorHex);
                  setPrevColor(colorHex);
                }}
              />
            ) : (
              <Box
                key={`layer-color-${i}`}
                w="full"
                h="18px"
                bg={colorHex}
                cursor="pointer"
                onClick={() => {
                  const c = colord(colorHex);
                  const rgb = c.toRgb();
                  const hsv = c.toHsv();
                  setPickerColor({ hex: colorHex, rgb, hsv });
                  setCurrentColor(colorHex);
                  setPrevColor(colorHex);
                }}
              />
            )
          )}
        </SimpleGrid>
      </VStack>
    </Panel>
  );
};
