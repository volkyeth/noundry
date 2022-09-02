import { ChakraProvider, Text, VStack, HStack, Box, Center, StackProps } from "@chakra-ui/react";
import { Sidebar } from "./components/layout/Sidebar";
import { Workspace } from "./components/layout/Workspace";
import theme from "./theme";
import { HexColorPicker } from "react-colorful";
import { Layers } from "./components/panels/Layers";
import "@fontsource/press-start-2p/400.css";
import { Panel } from "./components/panels/Panel";
import { Toolbox } from "./components/panels/Toolbox";
import { useToolboxState } from "./state/toolboxState";
import { FC } from "react";
import { Header } from "./components/layout/Header";
import { LeftSidebar } from "./components/layout/LeftSidebar";
import { Preview } from "./components/panels/Preview";
import { RightSidebar } from "./components/layout/RightSidebar";

function App() {
  return (
    <ChakraProvider theme={theme} resetCSS>
      <VStack color="white" fontFamily='"Press Start 2P", cursive' fontSize="8pt" h="100vh" minW="100vw" spacing={0}>
        <Header />
        <HStack w="full" h="full" p={0} justifyContent="space-between" spacing={0}>
          <LeftSidebar />
          <Workspace bgColor="gray.900" h="full" w="full" />
          <RightSidebar />
        </HStack>
      </VStack>
    </ChakraProvider>
  );
}

export default App;
