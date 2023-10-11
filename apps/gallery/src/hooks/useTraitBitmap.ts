import { Trait } from "@/types/trait";
import { useQuery } from "@tanstack/react-query";
import { EncodedTrait, colormap, decodeTrait } from "noggles";
import { useMainnetArtwork } from "./useMainnetArtwork";

export const useTraitBitmap = (trait: Trait | EncodedTrait) => {
  const { data: onchainArtwork } = useMainnetArtwork();
  const isEncodedTrait = typeof trait === "string";
  const { data: imageBitmap } = useQuery<ImageBitmap>({
    queryKey: isEncodedTrait
      ? ["encoded-trait-bitmap", trait]
      : ["trait-bitmap", trait.id],
    queryFn: () => {
      if (isEncodedTrait) {
        const { width, height, colorIndexes, paletteIndex } = decodeTrait(
          trait,
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

      return new Promise((resolve, reject) => {
        const image = new Image();
        image.onerror = reject;
        image.onload = () => {
          resolve(createImageBitmap(image));
        };
        image.src = trait.trait;
      });
    },
    staleTime: Infinity,
    cacheTime: Infinity,
    enabled: !isEncodedTrait || (isEncodedTrait && !!onchainArtwork),
  });

  return imageBitmap;
};
