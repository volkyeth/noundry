import loadingNoun from "@/assets/loading-noun.gif";
import { useMainnetArtwork } from "@/hooks/useMainnetArtwork";
import { PngDataUri } from "@/types/image";
import { generateSeed } from "@/utils/nouns/generateSeed";
import { getTraitsFromSeed } from "@/utils/nouns/getTraitsFromSeed";
import { EncodedTrait, HexColor, NounSeed, TraitType } from "noggles";
import { FC, HtmlHTMLAttributes, ReactNode, useState } from "react";
import { Noun } from "./Noun";
import { VirtualizedGallery } from "./VirtualizedGallery";

export interface TraitTestingGroundsProps
  extends HtmlHTMLAttributes<HTMLDivElement> {
  traitType: TraitType;
  trait: EncodedTrait | ImageBitmap | HexColor | PngDataUri;
  onNounClick?: (seed: NounSeed) => void;
  header?: ReactNode;
  footer?: ReactNode;
  classNames?: {
    card: string;
  };
  direction?: "horizontal" | "vertical";
  lanes?: number;
}

export const TraitTestingGrounds: FC<TraitTestingGroundsProps> = ({
  traitType,
  trait,
  onNounClick,
  header,
  footer,
  classNames,
  direction = "horizontal",
  lanes = 3,
  ...props
}) => {
  const { data: mainnetArtwork } = useMainnetArtwork();
  const [salt] = useState(Math.random());

  const NOUN_SIZE = 128;
  const NOUN_PADDING = 4;

  return (
    <VirtualizedGallery
      itemSize={NOUN_SIZE + 2 * NOUN_PADDING}
      scrollContainerPadding={4}
      hoverable={!!onNounClick}
      lanes={lanes}
      classNames={classNames}
      header={header}
      footer={footer}
      direction={direction}
      {...props}
    >
      {(virtualItem) => {
        if (!mainnetArtwork) {
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt="Loading Noun"
              src={loadingNoun.src}
              className="bg-gray-200 shadow-sm"
            />
          );
        }
        const seed: NounSeed = {
          ...generateSeed(mainnetArtwork, salt + virtualItem.index),
          background: virtualItem.index % mainnetArtwork.backgrounds.length,
        };
        const traits = {
          ...getTraitsFromSeed(seed, mainnetArtwork),
          [traitType]: trait,
        };

        return (
          <Noun
            onClick={onNounClick ? () => onNounClick?.(seed) : undefined}
            {...traits}
            size={320}
          />
        );
      }}
    </VirtualizedGallery>
  );
};
