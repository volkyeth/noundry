"use client";
import { siweClient } from "@/utils/siwe/siweClient";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { createContext, useState } from "react";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";

import { ThemedConnectKitProvider } from "@/components/ThemedConnectKitProvider";
import { getDefaultConfig } from "connectkit";
import { AppProps } from "next/app";
import { WagmiConfig, createConfig } from "wagmi";
import "../globals.css";

const config = createConfig(
  getDefaultConfig({
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID!,
    appName: "Noundry Gallery",
  })
);

export const MainContext = createContext({
  trigger: 1,
  setTrigger: (n: number) => {},
});

export default function MyApp({ Component, pageProps }: AppProps) {
  const [trigger, setTrigger] = useState(1);
  return (
    <NextUIProvider>
      <MainContext.Provider value={{ trigger, setTrigger }}>
        <WagmiConfig config={config}>
          <siweClient.Provider>
            <NextThemesProvider attribute="class" defaultTheme="dark">
              <ThemedConnectKitProvider
                options={{ enforceSupportedChains: false }}
              >
                <Navbar />
                <Component {...pageProps} />
                <Footer />
              </ThemedConnectKitProvider>
            </NextThemesProvider>
          </siweClient.Provider>
        </WagmiConfig>
      </MainContext.Provider>
    </NextUIProvider>
  );
}
