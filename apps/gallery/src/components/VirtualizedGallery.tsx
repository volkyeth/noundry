import { VirtualItem, useVirtualizer } from "@tanstack/react-virtual";
import { FC, HtmlHTMLAttributes, ReactNode, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { Hoverable } from "./Hoverable";

export interface VirtualizedGalleryProps
  extends Omit<HtmlHTMLAttributes<HTMLDivElement>, "children"> {
  itemSize: number;
  itemCount?: number;
  itemPadding?: number;
  hoverable?: boolean;
  scrollContainerPadding: number;
  initialScrollOffset?: number;
  header?: ReactNode;
  footer?: ReactNode;
  lanes?: number;
  classNames?: {
    card: string;
  };

  children: (virtualItem: VirtualItem) => ReactNode;
}

export const VirtualizedGallery: FC<VirtualizedGalleryProps> = ({
  itemSize,
  itemCount = 2_520, //magic number splits evenly on rows of up to 10 miniatures so there's no gaps in the bottom
  itemPadding = 4,
  hoverable = false,
  scrollContainerPadding,
  header,
  lanes = 3,
  initialScrollOffset = 0,
  classNames,
  className,
  footer,
  children,
  ...props
}) => {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { getVirtualItems, getTotalSize, measure, isScrolling } =
    useVirtualizer({
      getScrollElement: () => scrollContainerRef.current,
      horizontal: true,
      count: itemCount,
      initialOffset:
        (itemSize + itemPadding * 2) * (itemCount / lanes / 2) +
        initialScrollOffset,
      lanes,
      overscan: 16,
      estimateSize: () => itemSize,
    });

  useEffect(() => {
    measure();
  }, [measure, lanes]);

  return (
    <div
      ref={mainContainerRef}
      {...props}
      className={twMerge(
        "bg-content1 flex flex-col w-full py-5 px-4 mx-auto h-fit shadow-md overflow-auto",
        className,
        classNames?.card
      )}
    >
      {header}

      <div
        ref={scrollContainerRef}
        className={
          "overflow-auto w-full scrollbar-hide shadow-inset bg-gray-100"
        }
        style={{
          padding: `${scrollContainerPadding}px`,
        }}
      >
        <div
          className="relative"
          style={{
            width: `${getTotalSize()}px`,
            height: `${itemSize * lanes}px`,
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
                        left: 0,
                        padding: `${itemPadding}px`,
                        width: `${virtualItem.size}px`,
                        top: `${virtualItem.lane * virtualItem.size}px`,
                        height: `${virtualItem.size}px`,
                        transform: isHovered
                          ? `translateX(${virtualItem.start + 2}px)`
                          : `translateX(${virtualItem.start}px)`,
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
  );
};
