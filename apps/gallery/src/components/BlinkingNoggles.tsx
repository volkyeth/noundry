"use client";

import { FC, SVGAttributes, useEffect, useRef } from "react";

export const BlinkingNoggles: FC<SVGAttributes<SVGSVGElement>> = (props) => {
  const svgRef = useRef<SVGSVGElement>(null);
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
  return (
    <svg
      ref={svgRef}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 60"
      fill="currentColor"
    >
      <path
        id="frame"
        fillRule="evenodd"
        d="M100,30L100,60L160,60L160,0L100,0L100,20L90,20L90,0L30,0L30,20L0,20L0,50L10,50L10,30L30,30L30,60L90,60L90,30L100,30ZM80,10L40,10L40,50L80,50L80,10ZM150,10L110,10L110,50L150,50L150,10Z"
      />
      <path
        id="pupils"
        style={{ transformOrigin: "center" }}
        d="M60,10L60,50L80,50L80,10L60,10ZM130,10L130,50L150,50L150,10L130,10Z"
      />
    </svg>
  );
};
