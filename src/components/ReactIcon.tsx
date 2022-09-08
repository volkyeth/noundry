import { Icon, IconProps, chakra } from "@chakra-ui/react";
import { FC, forwardRef } from "react";
import { IconType } from "react-icons";

export type ReactIconProps = {
  icon: IconType;
} & IconProps;

export const ReactIcon: FC<ReactIconProps> = forwardRef<HTMLSpanElement, ReactIconProps>(({ icon, ...props }, ref) => {
  return (
    // wrapped in span as a workaround for https://github.com/react-icons/react-icons/issues/336
    <chakra.span ref={ref}>
      <Icon {...props} as={icon} />
    </chakra.span>
  );
});
