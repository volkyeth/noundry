import { PngDataUri } from "@/types/image";
import { useQuery } from "@tanstack/react-query";
import { EncodedTrait, colormap, decodeTrait } from "noggles";
import { useMainnetArtwork } from "./useMainnetArtwork";

export const useTraitBitmap = (
  trait: PngDataUri | EncodedTrait | ImageBitmap
) => {
  const { data: onchainArtwork } = useMainnetArtwork();
  const isEncodedTrait = typeof trait === "string" && trait.startsWith("0x");
  const isDataUri = typeof trait === "string" && trait.startsWith("data:");
  const isTraitBitmap = typeof trait === "object" && "width" in trait;
  const { data: imageBitmap } = useQuery<ImageBitmap | null>({
    queryKey: ["trait-bitmap", trait],
    queryFn: () => {
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
          image.onerror = reject;
          image.onload = () => {
            resolve(createImageBitmap(image));
          };
          image.src = trait;
        });
      }

      return null;
    },
    staleTime: Infinity,
    cacheTime: Infinity,
    enabled: isDataUri || (isEncodedTrait && !!onchainArtwork),
  });

  return isTraitBitmap ? trait : imageBitmap ?? undefined;
};
