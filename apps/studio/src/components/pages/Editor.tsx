import { HStack, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useUrlTraitParams } from "../../hooks/useUrlTraitParams";
import { useNounState } from "../../model/Noun";
import { CheatSheetButton } from "../CheatSheetButton";
import { Socials } from "../Socials";
import { Sidebar } from "../layout/Sidebar";
import { Workspace } from "../layout/Workspace";
import { Layers } from "../panels/Layers";
import { Palette } from "../panels/Palette";
import { Preview } from "../panels/Preview";
import { Toolbox } from "../panels/Toolbox";

/**
 * Editor component that supports loading traits via URL parameters.
 * 
 * Supported URL parameters:
 * - background: seed number (0-N) or image URI (HTTP/HTTPS/data URI)
 * - accessory: seed number (0-N) or image URI (HTTP/HTTPS/data URI)  
 * - head: seed number (0-N) or image URI (HTTP/HTTPS/data URI)
 * - glasses: seed number (0-N) or image URI (HTTP/HTTPS/data URI)
 * - body: seed number (0-N) or image URI (HTTP/HTTPS/data URI)
 * 
 * Examples:
 * - /?background=5&head=10&glasses=3
 * - /?head=https://example.com/head.png&background=2
 * - /?background=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0... (URL-encoded data URI)
 * 
 * Out-of-range seed numbers will be replaced with random values.
 * Missing parameters will be initialized with random values.
 * 
 * The initialization properly replaces the default random generation instead of 
 * drawing on top of it, ensuring clean trait loading.
 * 
 * Image URIs support CORS-enabled HTTP/HTTPS URLs and data URIs. External images
 * will be loaded with crossOrigin='anonymous' to avoid CORS issues.
 * 
 * Note: Data URIs must be URL-encoded when used in query parameters due to 
 * special characters like +, /, =, :, and ; that have special meaning in URLs.
 */
export const Editor = () => {
  const urlParams = useUrlTraitParams();
  const { initializeWithParams } = useNounState();

  useEffect(() => {
    // Initialize the noun with URL parameters (or random for missing ones)
    initializeWithParams(urlParams);
  }, [urlParams, initializeWithParams]);

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
