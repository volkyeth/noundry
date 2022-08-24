import { ChakraProvider, Text, VStack, HStack, Box } from "@chakra-ui/react";
import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Canvas, Workspace } from "./components/Workspace";
import theme from "./theme";
import { HexColorPicker } from "react-colorful";
import { Preview } from "./components/Preview";

export const App = () => {
  const [color, setColor] = useState("#000000");
  console.log(color);
  return (
    <ChakraProvider theme={theme}>
      <VStack h="100vh" minW="100vw" spacing={0}>
        <HStack
          bg="gray.800"
          w="full"
          h={20}
          p={6}
          justifyContent="space-between"
        >
          <Text fontSize="3xl" fontWeight="bold">
            Noundry Studio
          </Text>
        </HStack>
        <HStack
          w="full"
          h="full"
          p={0}
          justifyContent="space-between"
          spacing={0}
        >
          <Sidebar w={64}>
            <HexColorPicker
              style={{ width: "100%" }}
              color={color}
              onChange={setColor}
            />
            <Box bgColor={color} w={10} h={10} />
          </Sidebar>
          <Workspace paintColor={color} bgColor="gray.900" h="full" w="full" />
          <Sidebar w={96}>
            <Preview />
          </Sidebar>
        </HStack>
      </VStack>
    </ChakraProvider>
  );
};
