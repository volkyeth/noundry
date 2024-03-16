import { useCallback, useEffect, useState } from "react";

export type ElementSize = {
  width: number | undefined;
  height: number | undefined;
};

export const useSize = (ref: React.RefObject<HTMLElement>) => {
  const [size, setSize] = useState<ElementSize>({
    width: ref?.current?.offsetWidth,
    height: ref?.current?.offsetHeight,
  });

  const handleResize = useCallback(() => {
    setSize({
      width: ref?.current?.offsetWidth,
      height: ref?.current?.offsetHeight,
    });
  }, [setSize, ref]);

  useEffect(() => {
    if (!ref.current) return;

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref, handleResize]);

  return size;
};
