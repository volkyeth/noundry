import NoggleIcon from "public/mono-noggles.svg";
import { FC, SVGAttributes, useEffect, useRef } from "react";

export const BlinkingNoggles: FC<SVGAttributes<SVGSVGElement>> = (props) => {
  const svgRef = useRef<SVGSVGElement>();
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const scheduleBlink = () => {
      const delay = 30 * Math.random() * 1000;
      return setTimeout(() => {
        if (signal.aborted) return;
        svgRef?.current?.getElementById("pupils").animate(
          {
            transform: ["scaleY(1)", "scaleY(0)", "scaleY(1)"],
          },
          {
            duration: 150,
          }
        );
        scheduleBlink();
      }, delay);
    };

    scheduleBlink();

    return () => controller.abort();
  }, []);
  return <NoggleIcon ref={svgRef} {...props} />;
};
