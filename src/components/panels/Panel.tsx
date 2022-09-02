import { Box, BoxProps, StackProps, Text, VStack } from "@chakra-ui/react";
import { FC } from "react";

export type PanelProps = {
  title: string;
} & StackProps;

export const Panel: FC<StackProps> = ({ children, title, ...props }) => (
  <VStack {...props} bgColor="gray.700" w="full" p={2} pt={3} pb={4}>
    {/* <Text pb={4} fontSize={14} alignSelf="start">
      {title}
    </Text> */}
    {children}
  </VStack>
);
