"use client";

import { useEffect, useState } from "react";

export function LoadingNoggles({ theme, className }) {
  const [currentState, setCurrentState] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentState((currentState) =>
        currentState === 8 ? 1 : currentState + 1,
      );
    }, 85);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lensColor = theme === "dark" ? "white" : "black";
  const snakeColor = theme === "dark" ? "black" : "white";

  return (
    <div className={`my-2 mx-auto w-24 ${className}`}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 160 60"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
      >
        <g
          id="frame"
          style={{
            fill: lensColor,
          }}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M30 0H90V20H100V0H160V60H100V30H90V60H30V30H10V50H0V30V20H30V0Z"
          />
        </g>
        <g
          id="state-1"
          className="state"
          style={{
            fill: snakeColor,
            display: currentState === 1 ? "block" : "none",
          }}
        >
          <path d="M150 10H140V20H150V10Z" />
          <path d="M150 20H140V30H150V20Z" />
          <path d="M150 30H140V40H150V30Z" />
          <path d="M140 10H130V20H140V10Z" />
          <path d="M130 10H120V20H130V10Z" />
          <path d="M50 10H80V40H70V20H50V10Z" />
        </g>
        <g
          id="state-2"
          className="state"
          style={{
            fill: snakeColor,
            display: currentState === 2 ? "block" : "none",
          }}
        >
          <path d="M80 10H70V50H80V10Z" />
          <path d="M150 20H140V30H150V20Z" />
          <path d="M150 10H140V20H150V10Z" />
          <path d="M150 30H140V40H150V30Z" />
          <path d="M150 40H140V50H150V40Z" />
        </g>

        <g
          id="state-3"
          className="state"
          style={{
            fill: snakeColor,
            display: currentState === 3 ? "block" : "none",
          }}
        >
          <path d="M150 30H140V40H150V30Z" />
          <path d="M150 40H120V50H150V40Z" />
          <path d="M70 30H80V50H50V40H70V30Z" />
        </g>

        <g
          id="state-4"
          className="state"
          style={{
            fill: snakeColor,
            display: currentState === 4 ? "block" : "none",
          }}
        >
          <path d="M150 40H110V50H150V40Z" />
          <path d="M80 40H40V50H80V40Z" />
        </g>

        <g
          id="state-5"
          className="state"
          style={{
            fill: snakeColor,
            display: currentState === 5 ? "block" : "none",
          }}
        >
          <path d="M120 20H110V30H120V20Z" />
          <path d="M120 30H110V40H120V30Z" />
          <path d="M140 40H110V50H140V40Z" />
          <path d="M50 20H40V50H70V40H50V20Z" />
        </g>

        <g
          id="state-6"
          className="state"
          style={{
            fill: snakeColor,
            display: currentState === 6 ? "block" : "none",
          }}
        >
          <path d="M50 10H40V50H50V10Z" />
          <path d="M120 20H110V30H120V20Z" />
          <path d="M120 10H110V20H120V10Z" />
          <path d="M120 30H110V40H120V30Z" />
          <path d="M120 40H110V50H120V40Z" />
        </g>

        <g
          id="state-7"
          className="state"
          style={{
            fill: snakeColor,
            display: currentState === 7 ? "block" : "none",
          }}
        >
          <path d="M120 40H110V30H120V40Z" />
          <path d="M120 30H110V20H120V30Z" />
          <path d="M140 20H110V10H140V20Z" />
          <path d="M50 40H40V10H70V20H50V40Z" />
        </g>

        <g
          id="state-8"
          className="state"
          style={{
            fill: snakeColor,
            display: currentState === 8 ? "block" : "none",
          }}
        >
          <path d="M150 10H110V20H150V10Z" />
          <path d="M80 10H40V20H80V10Z" />
        </g>
      </svg>
    </div>
  );
}
