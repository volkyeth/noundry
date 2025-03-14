import { BoxProps } from "@chakra-ui/react";

export const checkerboardBg = (patternRepetitions = 32): Pick<BoxProps, "bgSize" | "bgGradient"> => ({
    bgSize: `${100 / patternRepetitions}% ${100 / patternRepetitions}%`,
    bgGradient: "repeating-conic(gray.500 0% 25%, gray.400 0% 50%)",
})