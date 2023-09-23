import { StackProps, VStack } from "@chakra-ui/react";
import { FC } from "react";

export const Sidebar: FC<StackProps> = ({ children, ...props }) => (
  <VStack bgColor="gray.800" h="full" p={1} pt={0} spacing={1} {...props}>
    {children}
  </VStack>
);
