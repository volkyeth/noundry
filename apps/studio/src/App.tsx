import { ChakraProvider, useColorMode } from "@chakra-ui/react";
import "@fontsource/press-start-2p";
import "@fontsource/vt323";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { inject } from "@vercel/analytics";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { BraveDisclaimer } from "./components/BraveDisclaimer";
import { MainLayout } from "./components/layout/MainLayout";
import { Editor } from "./components/pages/Editor";
import { PaletteFixer } from "./components/pages/PaletteFixer";
import theme from "./theme";

const App = () => {
  inject({ debug: false });
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
          </Routes>
        </MainLayout>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

// TODO Remove this. It's here to fix the color mode on local storage for people that opened the app before the color mode was (correctly) set to dark.
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
