import NounIcon from "@/assets/traitIcons/noun.svg";
import { Button } from "@/components/Button";
import { TraitIcon } from "@/components/TraitIcon";
import { useMainnetArtwork } from "@/hooks/useMainnetArtwork";
import { PngDataUri } from "@/types/image";
import { generateSeed } from "@/utils/nouns/generateSeed";
import { getTraitsFromSeed } from "@/utils/nouns/getTraitsFromSeed";
import { appConfig } from "@/variants/config";
import { useDisclosure } from "@nextui-org/react";
import { EncodedTrait, HexColor, NounSeed, TraitType } from "noggles";
import { FC, HtmlHTMLAttributes, ReactNode, useState } from "react";
import { Noun } from "./Noun";
import { VirtualizedGallery } from "./VirtualizedGallery";
const { loadingNoun } = appConfig;

export interface TraitWithFriendsProps
  extends HtmlHTMLAttributes<HTMLDivElement> {
  traitType: TraitType;
  trait: EncodedTrait | ImageBitmap | HexColor | PngDataUri;
  onNounClick?: (seed: NounSeed) => void;
  header?: ReactNode;
}

export const TraitWithFriends: FC<TraitWithFriendsProps> = ({
  traitType,
  trait,
  onNounClick,
  header,
  ...props
}) => {
  const { data: mainnetArtwork } = useMainnetArtwork();
  const { isOpen: showFullNoun, onOpenChange: toggleShowFullNoun } =
    useDisclosure({ defaultOpen: true });
  const [salt] = useState(Math.random());

  const NOUN_SIZE = 128;
  const NOUN_PADDING = 4;

  return (
    <VirtualizedGallery
      itemSize={NOUN_SIZE + 2 * NOUN_PADDING}
      scrollContainerPadding={4}
      hoverable={!!onNounClick}
      lanes={2}
      header={header}
      footer={
        <Button
          variant="ghost"
          size="sm"
          className="self-end mt-1 -mb-2 p-1"
          onClick={toggleShowFullNoun}
        >
          {showFullNoun ? (
            <NounIcon className={"h-4 text-secondary"} />
          ) : (
            <TraitIcon type={traitType} className={"h-4 text-secondary"} />
          )}
        </Button>
      }
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
        const fullNounTraits = {
          ...getTraitsFromSeed(seed, mainnetArtwork),
          ...(virtualItem.index % 4 === 0 ? { [traitType]: trait } : {}),
        };

        const traits = showFullNoun
          ? fullNounTraits
          : {
              background: fullNounTraits.background,
              [traitType]: fullNounTraits[traitType],
            };

        return (
          <div className="grid">
            <Noun
              onClick={onNounClick ? () => onNounClick?.(seed) : undefined}
              {...traits}
              className={"overlap"}
              size={320}
            />
          </div>
        );
      }}
    </VirtualizedGallery>
  );
};
