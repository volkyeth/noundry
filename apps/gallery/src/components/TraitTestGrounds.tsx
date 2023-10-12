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

export interface TraitTestingGroundsProps
  extends HtmlHTMLAttributes<HTMLDivElement> {
  trait: Trait;
}

const NOUN_SIZE = 128;
const NOUN_PADDING = 4;
const SCROLL_CONTAINER_PADDING = NOUN_PADDING;
const CARD_PADDING = 16;
const CARD_SIZE = NOUN_SIZE + NOUN_PADDING * 2;

export const TraitTestingGrounds: FC<TraitTestingGroundsProps> = ({
  trait,
  ...props
}) => {
  const { data: mainnetArtwork } = useMainnetArtwork();
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { width } = useSize(mainContainerRef);
  const [salt] = useState(Math.random());
  const lanes = width
    ? Math.floor(
        (width - 2 * CARD_PADDING - 2 * SCROLL_CONTAINER_PADDING) / CARD_SIZE
      )
    : 5;

  const { getVirtualItems, getTotalSize, options, setOptions, measure } =
    useVirtualizer({
      getScrollElement: () => scrollContainerRef.current,
      count: 2_520, //magic number splits evenly on rows of up to 10 miniatures so there's no gaps in the botoom
      lanes,
      overscan: 50,
      estimateSize: () => CARD_SIZE,
    });

  useEffect(() => {
    measure();
  }, [measure, lanes]);

  return (
    <div {...props} ref={mainContainerRef}>
      <div
        className="bg-content1 flex flex-col w-fit py-5 mx-auto h-full"
        style={{
          paddingLeft: `${CARD_PADDING}px`,
          paddingRight: `${CARD_PADDING}px`,
        }}
      >
        <h2 className="py-3 text-xl font-bold text-gray-500 text-center">
          Testing grounds
        </h2>
        <div
          ref={scrollContainerRef}
          className={"overflow-auto w-fit my-2 bg-gray-50 "}
          style={{
            padding: `${NOUN_PADDING}px`,
          }}
        >
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
        </div>
      </div>
    </div>
  );
};
