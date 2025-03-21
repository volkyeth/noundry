import { useQuery } from "@tanstack/react-query";
import { EncodedTrait, colormap, decodeTrait } from "noggles";
import { useMainnetArtwork } from "./useMainnetArtwork";

// Define the PngDataUri type
type PngDataUri = string;

export const useTraitBitmap = (
  trait?: PngDataUri | EncodedTrait | ImageBitmap | null
) => {
  const { data: onchainArtwork } = useMainnetArtwork();
  const isEncodedTrait = typeof trait === "string" && trait?.startsWith("0x");
  const isDataUri = typeof trait === "string" && trait?.startsWith("data:");
  const isTraitBitmap = trait !== null && typeof trait === "object" && "width" in trait;

  const { data: imageBitmap } = useQuery<ImageBitmap | null>({
    queryKey: ["trait-bitmap", trait],
    queryFn: () => {
      // Return null early if trait is null or undefined
      if (trait === null || trait === undefined) {
        return null;
      }

      if (isEncodedTrait) {
        const { width, height, colorIndexes, paletteIndex } = decodeTrait(
          trait as EncodedTrait,
          32,
          32
        );
        if (!onchainArtwork?.palettes[paletteIndex])
          throw new Error(`Palette index ${paletteIndex} is out of bounds`);
        const { data } = colormap(
          { width, height, colorIndexes },
          onchainArtwork?.palettes[paletteIndex]
        );

        return createImageBitmap(new ImageData(data, width, height));
      }

      if (isDataUri) {
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.onerror = () => resolve(null);
          image.onload = () => {
            try {
              resolve(createImageBitmap(image));
            } catch (error) {
              console.error("Error creating image bitmap:", error);
              resolve(null);
            }
          };
          image.src = trait as string;
        });
      }

      return isTraitBitmap ? trait as ImageBitmap : null;
    },
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: (trait !== null && isDataUri) || (isEncodedTrait && !!onchainArtwork),
  });

  if (trait === undefined || trait === null) return null;
  return isTraitBitmap ? trait as ImageBitmap : imageBitmap ?? null;
};
