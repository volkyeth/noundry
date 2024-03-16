import { FC, SVGAttributes, useEffect, useId, useRef } from "react";

export interface BlinkingNogglesProps extends SVGAttributes<SVGSVGElement> {
  inverted?: boolean;
}

export const BlinkingNoggles: FC<BlinkingNogglesProps> = ({
  inverted = false,
  ...props
}) => {
  const pupilsRef = useRef<SVGPathElement>(null);
  const maskId = useId();
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const scheduleBlink = () => {
      const delay = 30 * Math.random() * 1000;
      return setTimeout(() => {
        if (signal.aborted) return;
        pupilsRef?.current?.animate(
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
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 60"
      fill="currentColor"
      {...props}
    >
      <defs>
        <mask id={maskId}>
          <rect width="160" height="60" fill="white" />

          <path
            id="pupils"
            ref={pupilsRef}
            style={{ transformOrigin: "center" }}
            fill="black"
            d={
              inverted
                ? "M60,10L60,50L80,50L80,10L60,10ZM130,10L130,50L150,50L150,10L130,10Z"
                : "M40,10L40,50L60,50L60,10L60,10ZM110,10L110,50L130,50L130,10L110,10Z"
            }
          />
        </mask>
      </defs>
      <path
        id="frame"
        fillRule="evenodd"
        mask={`url(#${maskId})`}
        d="M100,30L100,60L160,60L160,0L100,0L100,20L90,20L90,0L30,0L30,20L0,20L0,50L10,50L10,30L30,30L30,60L90,60L90,30L100,30"
      />
    </svg>
  );
};
