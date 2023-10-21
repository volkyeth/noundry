import { useSize } from "@/hooks/useSize";
import { VirtualItem, useVirtualizer } from "@tanstack/react-virtual";
import { FC, HtmlHTMLAttributes, ReactNode, useEffect, useRef } from "react";

export interface VirtualizedGalleryProps
  extends Omit<HtmlHTMLAttributes<HTMLDivElement>, "children"> {
  itemSize: number;
  itemCount?: number;
  scrollContainerPadding: number;
  header?: ReactNode;
  footer?: ReactNode;
  children: (virtualItem: VirtualItem) => ReactNode;
}

export const VirtualizedGallery: FC<VirtualizedGalleryProps> = ({
  itemSize,
  itemCount = 2_520, //magic number splits evenly on rows of up to 10 miniatures so there's no gaps in the bottom
  scrollContainerPadding,
  header,
  footer,
  children,
  ...props
}) => {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { width } = useSize(mainContainerRef);
  const lanes = Math.min(
    width ? Math.floor((width - 2 * scrollContainerPadding) / itemSize) : 5,
    itemCount
  );

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
      <div className="bg-content1 flex flex-col w-fit py-5 px-4 mx-auto h-full">
        {header}
        <div
          ref={scrollContainerRef}
          className={"overflow-auto w-fit  bg-gray-50 "}
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
        {footer}
      </div>
    </div>
  );
};
