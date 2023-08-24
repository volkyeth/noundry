import { StackProps, VStack } from "@chakra-ui/react";
import { FC } from "react";

export type PanelProps = {
  title: string;
} & StackProps;

export const Panel: FC<StackProps> = ({ children, title, ...props }) => (
  <VStack {...props} bgColor="gray.700" w="full" px={2} py={3}>
    {/* <Text pb={4} fontSize={14} alignSelf="start">
      {title}
    </Text> */}
    {children}
  </VStack>
);
