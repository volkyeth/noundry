import { Box, Image, Text } from "@chakra-ui/react";
import { ImageData, getNounData } from "@nouns/assets";
import { buildSVG } from "@nouns/sdk";
const { palette } = ImageData; // Used with `buildSVG``

export const Preview = () => {
  const seed = {
    background: 0,
    body: 17,
    accessory: 41,
    head: 71,
    glasses: 2,
  };
  const { parts, background } = getNounData(seed);
  const svgBinary = buildSVG(parts, palette, background);
  const svgBase64 = btoa(svgBinary);
  return (
    <Box>
      <Image src={`data:image/svg+xml;base64,${svgBase64}`} />
    </Box>
  );
};
