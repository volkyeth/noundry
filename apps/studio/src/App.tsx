import { ChakraProvider, useColorMode } from "@chakra-ui/react";
import "@fontsource/press-start-2p";
import "@fontsource/vt323";
import { inject } from "@vercel/analytics";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Route, Routes } from "react-router-dom";
import { WagmiConfig, createConfig, mainnet } from "wagmi";
import ckTheme from "./ckTheme.json";
import { BraveDisclaimer } from "./components/BraveDisclaimer";
import { MainLayout } from "./components/layout/MainLayout";
import { Editor } from "./components/pages/Editor";
import { PaletteFixer } from "./components/pages/PaletteFixer";
import { Propose } from "./components/pages/Propose";
import theme from "./theme";

const config = createConfig(
  getDefaultConfig({
    alchemyId: import.meta.env.VITE_ALCHEMY_API_KEY,
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_ID,
    appName: "Noundry Studio",
    appUrl: "https://studio.noundry.wtf",
    chains: [mainnet],
  })
);

console.log(ckTheme);

const App = () => {
  inject({ debug: false });
  const queryClient = new QueryClient();
  return (
    <ChakraProvider theme={theme} resetCSS>
      <ColorModeFixer />
      <BraveDisclaimer />
      <QueryClientProvider client={queryClient}>
        <WagmiConfig config={config}>
          <ConnectKitProvider
            customTheme={ckTheme}
            options={{ enforceSupportedChains: false }}
          >
            <MainLayout>
              <Routes>
                <Route path="/" element={<Editor />} />
                <Route path="palette" element={<PaletteFixer />} />
                <Route path="propose" element={<Propose />} />
                <Route path="propose/:partType" element={<Propose />} />
              </Routes>
            </MainLayout>
          </ConnectKitProvider>
        </WagmiConfig>
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
