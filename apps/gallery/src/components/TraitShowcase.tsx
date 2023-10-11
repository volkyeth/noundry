import { useMainnetArtwork } from "@/hooks/useMainnetArtwork";
import { useSize } from "@/hooks/useSize";
import { Trait } from "@/types/trait";
import { traitType } from "@/utils/misc/traitType";
import { generateSeed } from "@/utils/nouns/generateSeed";
import { getTraitsFromSeed } from "@/utils/nouns/getTraitsFromSeed";
import { useVirtualizer } from "@tanstack/react-virtual";
import loadingNoun from "public/loading-noun.gif";
import { FC, HtmlHTMLAttributes, useEffect, useRef, useState } from "react";
import { Noun } from "./Noun";

export interface TraitShowcaseProps extends HtmlHTMLAttributes<HTMLDivElement> {
  trait: Trait;
}

const NOUN_SIZE = 128;
const NOUN_PADDING = 4;
const CARD_SIZE = NOUN_SIZE + NOUN_PADDING * 2;

export const TraitTestingGrounds: FC<TraitShowcaseProps> = ({
  trait,
  ...props
}) => {
  const { data: mainnetArtwork } = useMainnetArtwork();
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { width } = useSize(mainContainerRef);
  const [salt] = useState(Math.random());
  const lanes = width ? Math.floor(width / CARD_SIZE) : 5;

  const { getVirtualItems, getTotalSize, options, setOptions, measure } =
    useVirtualizer({
      getScrollElement: () => scrollContainerRef.current,
      count: 1_000,
      lanes,
      overscan: 50,
      estimateSize: () => CARD_SIZE,
    });

  useEffect(() => {
    measure();
  }, [measure, lanes]);

  return (
    <div {...props} ref={mainContainerRef}>
      <div className="bg-content1 px-4 py-5 w-fit mx-auto h-full">
        <h2 className="pb-3 text-xl font-bold text-gray-500 text-center">
          Testing grounds
        </h2>
        <div ref={scrollContainerRef} className={"h-full overflow-auto w-fit"}>
          <div
            className="relative"
            style={{
              height: `${getTotalSize()}px`,
              width: `${CARD_SIZE * lanes}px`,
            }}
          >
            {getVirtualItems().map((virtualItem) => {
              if (!mainnetArtwork) {
                return (
                  <div
                    key={virtualItem.key}
                    style={{
                      position: "absolute",
                      top: 0,
                      width: `${virtualItem.size}px`,
                      left: `${virtualItem.lane * virtualItem.size}px`,
                      height: `${virtualItem.size}px`,
                      padding: `${NOUN_PADDING}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                    className="bg-content1"
                  >
                    <img src={loadingNoun.src} className="bg-gray-200" />
                  </div>
                );
              }
              const seed = generateSeed(
                mainnetArtwork,
                salt + virtualItem.index
              );
              const traits = {
                ...getTraitsFromSeed(seed, mainnetArtwork),
                [traitType(trait)]: trait,
              };

              return (
                <Noun
                  key={virtualItem.key}
                  className="bg-content1"
                  {...traits}
                  size={320}
                  style={{
                    position: "absolute",
                    top: 0,
                    width: `${virtualItem.size}px`,
                    left: `${virtualItem.lane * virtualItem.size}px`,
                    height: `${virtualItem.size}px`,
                    padding: `${NOUN_PADDING}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                />
              );
            })}
          </div>
          h
        </div>
      </div>
    </div>
  );
};
