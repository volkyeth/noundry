import { ChakraProvider, useColorMode } from "@chakra-ui/react";
import "@fontsource/press-start-2p";
import "@fontsource/vt323";
import { inject } from "@vercel/analytics";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Route, Routes } from "react-router-dom";
import { BraveDisclaimer } from "./components/BraveDisclaimer";
import { MainLayout } from "./components/layout/MainLayout";
import { Editor } from "./components/pages/Editor";
import { PaletteFixer } from "./components/pages/PaletteFixer";
import { Propose } from "./components/pages/Propose";
import theme from "./theme";

const App = () => {
  inject();
  const queryClient = new QueryClient();
  return (
    <ChakraProvider theme={theme} resetCSS>
      <ColorModeFixer />
      <BraveDisclaimer />
      <QueryClientProvider client={queryClient}>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Editor />} />
            <Route path="palette" element={<PaletteFixer />} />
            <Route path="propose" element={<Propose />} />
            <Route path="propose/:partType" element={<Propose />} />
          </Routes>
        </MainLayout>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

// @TODO Remove this. It's here to fix the color mode on local storage for people that opened the app before the color mode was (correctly) set to dark.
const ColorModeFixer = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  useEffect(() => {
    if (colorMode === "light") {
      toggleColorMode();
    }
  }, [colorMode]);

  return <></>;
};

export default App;
