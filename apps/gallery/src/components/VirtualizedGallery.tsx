import { cn } from "@nextui-org/react";
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
  initialScrollOffset?: number;
  header?: ReactNode;
  footer?: ReactNode;
  lanes?: number;
  classNames?: {
    card: string;
  };
  direction?: "horizontal" | "vertical";

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
  direction = "horizontal",
  ...props
}) => {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isHorizontal = direction === "horizontal";

  const { getVirtualItems, getTotalSize, measure, isScrolling } =
    useVirtualizer({
      getScrollElement: () => scrollContainerRef.current,
      horizontal: isHorizontal,
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
      className={cn(
        "bg-content1 flex flex-col  py-5 px-4 mx-auto shadow-md overflow-auto",
        isHorizontal ? "w-full h-fit" : "h-full w-fit",
        className,
        classNames?.card
      )}
    >
      {header}

      <div
        ref={scrollContainerRef}
        className={
          cn("overflow-auto scrollbar-hide non-touchscreen:overscroll-contain shadow-inset bg-gray-100 overscroll-contain",
          isHorizontal ? "w-full" : "h-full")
        }
        onWheel={(e) => {
          e.stopPropagation();
          if (isHorizontal) {
            scrollContainerRef.current!.scrollLeft += e.deltaY;
          } else {
            scrollContainerRef.current!.scrollTop += e.deltaY;
          }
        }}
        style={{
          padding: `${scrollContainerPadding}px`,
        }}
      >
        <div
          className="relative"
          style={{
            width: isHorizontal ? `${getTotalSize()}px` : `${itemSize * lanes}px`,
            height: isHorizontal ? `${itemSize * lanes}px` : `${getTotalSize()}px`,
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
                        padding: `${itemPadding}px`,
                        width: `${virtualItem.size}px`,
                        height: `${virtualItem.size}px`,
                        ...(isHorizontal
                          ? {
                              left: 0,
                              top: `${virtualItem.lane * virtualItem.size}px`,
                              transform: isHovered
                                ? `translateX(${virtualItem.start + 2}px)`
                                : `translateX(${virtualItem.start}px)`,
                            }
                          : {
                              top: 0,
                              left: `${virtualItem.lane * virtualItem.size}px`,
                              transform: isHovered
                                ? `translateY(${virtualItem.start + 2}px)`
                                : `translateY(${virtualItem.start}px)`,
                            }),
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
