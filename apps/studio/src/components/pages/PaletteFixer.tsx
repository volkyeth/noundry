import { Text, VStack } from "@chakra-ui/react";
import { PartImporter } from "../PartImporter";

export const PaletteFixer = () => {
  return (
    <VStack
      bgColor="gray.900"
      color="gray.100"
      h="100vh"
      minW="100vw"
      spacing={10}
      py={6}
    >
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
