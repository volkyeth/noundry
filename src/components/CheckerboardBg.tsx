import { FC } from "react";
import { Center, CenterProps } from "@chakra-ui/react";

export type CheckerboardBgProps = {
  patternRepetitions?: number;
} & CenterProps;

export const CheckerboardBg: FC<CheckerboardBgProps> = ({ children, patternRepetitions = 32, ...props }) => {
  return (
    <Center
      bgSize={`${100 / patternRepetitions}% ${100 / patternRepetitions}%`}
      bgGradient="repeating-conic(gray.500 0% 25%, gray.400 0% 50%)"
      {...props}
    >
      {children}
    </Center>
  );
};
