import { useMainnetArtwork } from "@/hooks/useMainnetArtwork";
import { PngDataUri } from "@/types/image";
import { generateSeed } from "@/utils/nouns/generateSeed";
import { getTraitsFromSeed } from "@/utils/nouns/getTraitsFromSeed";
import { EncodedTrait, HexColor, NounSeed, TraitType } from "noggles";
import loadingNoun from "public/loading-noun.gif";
import { FC, HtmlHTMLAttributes, ReactNode, useState } from "react";
import { Hoverable } from "./Hoverable";
import { Noun } from "./Noun";
import { VirtualizedGallery } from "./VirtualizedGallery";

export interface TraitTestingGroundsProps
  extends HtmlHTMLAttributes<HTMLDivElement> {
  traitType: TraitType;
  trait: EncodedTrait | ImageBitmap | HexColor | PngDataUri;
  onNounClick?: (seed: NounSeed) => void;
  header?: ReactNode;
  footer?: ReactNode;
}

export const TraitTestingGrounds: FC<TraitTestingGroundsProps> = ({
  traitType,
  trait,
  onNounClick,
  header,
  footer,
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
      header={header}
      footer={footer}
      {...props}
    >
      {(virtualItem) => {
        if (!mainnetArtwork) {
          return (
            <div style={{ padding: `${NOUN_PADDING}px` }}>
              <img src={loadingNoun.src} className="bg-gray-200 shadow-sm" />
            </div>
          );
        }
        const seed = generateSeed(mainnetArtwork, salt + virtualItem.index);
        const traits = {
          ...getTraitsFromSeed(seed, mainnetArtwork),
          [traitType]: trait,
        };

        return (
          <Hoverable key={virtualItem.key} isDisabled={!onNounClick}>
            {({ isHovered, onMouseEnter, onMouseLeave }) => {
              return (
                <div
                  style={{
                    padding: `${NOUN_PADDING}px`,
                    backgroundColor: isHovered
                      ? "lab(var(--nextui-primary))"
                      : undefined,
                  }}
                >
                  <Noun
                    className="shadow-sm"
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    onClick={
                      onNounClick ? () => onNounClick?.(seed) : undefined
                    }
                    {...traits}
                    size={320}
                  />
                </div>
              );
            }}
          </Hoverable>
        );
      }}
    </VirtualizedGallery>
  );
};
