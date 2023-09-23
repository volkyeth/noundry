import { StackProps, VStack } from "@chakra-ui/react";
import { FC } from "react";
import { Header } from "./Header";

export const MainLayout: FC<StackProps> = ({ children }) => (
  <VStack color="white" bgColor={"gray.900"} fontSize="8pt" h="full" w="full" spacing={0}>
    <Header />
    {children}
  </VStack>
);
