import { HStack, VStack } from "@chakra-ui/react";
import { CheatSheetButton } from "../CheatSheetButton";
import { Socials } from "../Socials";
import { Sidebar } from "../layout/Sidebar";
import { Workspace } from "../layout/Workspace";
import { Layers } from "../panels/Layers";
import { Palette } from "../panels/Palette";
import { Preview } from "../panels/Preview";
import { Toolbox } from "../panels/Toolbox";

export const Editor = () => {
  return (
    <HStack w="full" h="full" p={0} justifyContent="space-between" spacing={0}>
      <Sidebar w={64} zIndex={100}>
        <Toolbox />
        <Palette />
      </Sidebar>
      <Workspace bgColor="gray.900" h="full" w="full" />
      <Sidebar w="352px" justifyContent={"space-between"} zIndex={100}>
        <VStack>
          <Preview />
          <Layers />
        </VStack>
        <HStack w={"full"} justifyContent={"space-between"}>
          <CheatSheetButton />
          <Socials p={2} h={10} />
        </HStack>
      </Sidebar>
    </HStack>
  );
};
