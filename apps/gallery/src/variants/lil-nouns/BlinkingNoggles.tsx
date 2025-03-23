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
          },
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
      viewBox="0 0 200 80"
      fill="currentColor"
    >
      <path
        id="frame"
        fillRule="evenodd"
        d="M30 0H110V10V20V30H120V20V10V0H200V10V20V30V40V50V60V70V80H120V70V60V50V40H110V50V60V70V80H30V70V60V50V40H10V50V60H0V50V40V30H30V20V10V0ZM40 70H100V60V50V40V30V20V10H40V20V30V40V50V60V70ZM190 60V70H130V60V50V40V30V20V10H190V20V30V40V50V60Z"
      />
      <path
        id="pupils"
        style={{ transformOrigin: "center" }}
        d="M100 10H60V20V30V40V50V60V70H100V60V50V40V30V20V10ZM150 20V30V40V50V60V70H190V60V50V40V30V20V10H150V20Z"
      />
    </svg>
  );
};
