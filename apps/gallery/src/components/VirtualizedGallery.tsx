import { useSize } from "@/hooks/useSize";
import { VirtualItem, useVirtualizer } from "@tanstack/react-virtual";
import { FC, HtmlHTMLAttributes, ReactNode, useEffect, useRef } from "react";
import { Hoverable } from "./Hoverable";

export interface VirtualizedGalleryProps
  extends Omit<HtmlHTMLAttributes<HTMLDivElement>, "children"> {
  itemSize: number;
  itemCount?: number;
  itemPadding?: number;
  hoverable?: boolean;
  scrollContainerPadding: number;
  header?: ReactNode;
  footer?: ReactNode;
  children: (virtualItem: VirtualItem) => ReactNode;
}

export const VirtualizedGallery: FC<VirtualizedGalleryProps> = ({
  itemSize,
  itemCount = 2_520, //magic number splits evenly on rows of up to 10 miniatures so there's no gaps in the bottom
  itemPadding = 4,
  hoverable = false,
  scrollContainerPadding,
  header,
  footer,
  children,
  ...props
}) => {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { width } = useSize(mainContainerRef);
  const paddedItemSize = itemSize + 2 * itemPadding;
  const lanes = Math.min(
    width
      ? Math.floor((width - 2 * scrollContainerPadding) / paddedItemSize)
      : 5,
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
      <div className="bg-content1 flex flex-col w-fit py-5 px-4 mx-auto h-full shadow-md">
        {header}
        <div
          ref={scrollContainerRef}
          className={"overflow-auto w-fit  bg-gray-100 shadow-inset"}
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
                <Hoverable key={virtualItem.key} isDisabled={!hoverable}>
                  {({ isHovered, onMouseEnter, onMouseLeave }) => {
                    return (
                      <div
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        style={{
                          position: "absolute",
                          top: 0,
                          padding: `${itemPadding}px`,
                          width: `${virtualItem.size}px`,
                          left: `${virtualItem.lane * virtualItem.size}px`,
                          height: `${virtualItem.size}px`,
                          transform: isHovered
                            ? `translateY(${virtualItem.start + 2}px)`
                            : `translateY(${virtualItem.start}px)`,
                        }}
                      >
                        <div
                          style={{
                            boxShadow: isHovered
                              ? "0 0px #bdbdbd"
                              : "0 2px #bdbdbd",
                          }}
                        >
                          {children(virtualItem)}
                        </div>
                      </div>
                    );
                  }}
                </Hoverable>
              );
            })}
          </div>
        </div>
        {footer}
      </div>
    </div>
  );
};
