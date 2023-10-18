import { useSize } from "@/hooks/useSize";
import { VirtualItem, useVirtualizer } from "@tanstack/react-virtual";
import {
  HtmlHTMLAttributes,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
} from "react";

export interface VirtualizedGalleryProps<ItemType>
  extends Omit<HtmlHTMLAttributes<HTMLDivElement>, "children"> {
  itemSize: number;
  itemCount?: number;
  scrollContainerPadding: number;
  title?: string;
  children: (virtualItem: VirtualItem) => ReactNode;
}

export const VirtualizedGallery = <ItemType,>({
  itemSize,
  itemCount = 2_520, //magic number splits evenly on rows of up to 10 miniatures so there's no gaps in the bottom
  scrollContainerPadding,
  title,
  children,
  ...props
}: VirtualizedGalleryProps<ItemType>): ReactElement => {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { width } = useSize(mainContainerRef);
  const lanes = width
    ? Math.floor((width - 2 * scrollContainerPadding) / itemSize)
    : 5;

  const { getVirtualItems, getTotalSize, measure } = useVirtualizer({
    getScrollElement: () => scrollContainerRef.current,
    count: itemCount,
    lanes,
    overscan: 50,
    estimateSize: () => itemSize,
  });

  useEffect(() => {
    measure();
  }, [measure, lanes]);

  return (
    <div {...props} ref={mainContainerRef}>
      <div className="bg-content1 flex flex-col w-fit py-5 px-2 mx-auto h-full">
        {title && (
          <h2 className="py-3 text-xl font-bold text-gray-500 text-center">
            {title}
          </h2>
        )}
        <div
          ref={scrollContainerRef}
          className={"overflow-auto w-fit m-2 bg-gray-50 "}
          style={{
            padding: `${scrollContainerPadding}px`,
          }}
        >
          <div
            className="relative"
            style={{
              height: `${getTotalSize()}px`,
              width: `${itemSize * lanes}px`,
            }}
          >
            {getVirtualItems().map((virtualItem) => {
              return (
                <div
                  key={virtualItem.key}
                  style={{
                    position: "absolute",
                    top: 0,
                    width: `${virtualItem.size}px`,
                    left: `${virtualItem.lane * virtualItem.size}px`,
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  {children(virtualItem)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
