import { HStack, VStack } from "@chakra-ui/react";
import { Header } from "../layout/Header";
import { Sidebar } from "../layout/Sidebar";
import { Workspace } from "../layout/Workspace";
import { Layers } from "../panels/Layers";
import { Palette } from "../panels/Palette";
import { Preview } from "../panels/Preview";
import { Toolbox } from "../panels/Toolbox";
import { Socials } from "../Socials";

export const Editor = () => (
  <VStack color="white" fontSize="8pt" h="100vh" minW="100vw" spacing={0}>
    <Header />
    <HStack w="full" h="full" p={0} justifyContent="space-between" spacing={0}>
      <Sidebar w={64}>
        <Toolbox />
        <Palette />
      </Sidebar>
      <Workspace bgColor="gray.900" h="full" w="full" />
      <Sidebar w="352px" justifyContent={"space-between"}>
        <VStack>
          <Preview />
          <Layers />
        </VStack>
        <Socials p={2} h={10} justifyContent={"end"} w={"full"} />
      </Sidebar>
    </HStack>
  </VStack>
);
