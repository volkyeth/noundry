import { FC, MouseEventHandler, ReactElement, useState } from "react";

export interface HoverableProps {
  children: ({
    onMouseEnter,
    onMouseLeave,
    isHovered,
  }: {
    onMouseEnter: MouseEventHandler;
    onMouseLeave: MouseEventHandler;
    isHovered: boolean;
  }) => ReactElement;
  isDisabled?: boolean;
}

export const Hoverable: FC<HoverableProps> = ({
  children,
  isDisabled = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return children({
    onMouseEnter: isDisabled
      ? () => {}
      : () => {
          setIsHovered(true);
        },
    onMouseLeave: isDisabled
      ? () => {}
      : () => {
          setIsHovered(false);
        },
    isHovered,
  });
};
