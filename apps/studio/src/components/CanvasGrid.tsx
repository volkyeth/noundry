import { FC } from "react";
import { Box, Center, BoxProps } from "@chakra-ui/react";

export type CanvasGridProps = {
  cells?: number;
} & BoxProps;

export const CanvasGrid: FC<CanvasGridProps> = ({ children, cells = 32, ...props }) => {
  return (
    <Box
      borderRightWidth={1}
      borderBottomWidth={1}
      bgSize={`${100 / cells}% ${100 / cells}%`}
      bgGradient="repeating-linear-gradient(#ccc 0 1px, transparent 1px 100%), repeating-linear-gradient(90deg, #ccc 0 1px, transparent 1px 100%)"
      {...props}
    >
      {children}
    </Box>
  );
};
