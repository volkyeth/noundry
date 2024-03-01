import InvertedNoggleIcon from "public/mono-noggles-inverted.svg";
import NoggleIcon from "public/mono-noggles.svg";
import { FC, SVGAttributes, useEffect, useRef } from "react";

export interface BlinkingNogglesProps extends SVGAttributes<SVGSVGElement> {
  inverted?: boolean;
}

export const BlinkingNoggles: FC<BlinkingNogglesProps> = ({
  inverted = false,
  ...props
}) => {
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

  const Icon = inverted ? InvertedNoggleIcon : NoggleIcon;
  return <Icon ref={svgRef} {...props} />;
};
