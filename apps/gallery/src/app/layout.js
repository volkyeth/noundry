"use client";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";

import "./globals.css";

import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { createContext, useState } from "react";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";

//---------------
const chains1 = [mainnet];
const projectId = "efc7f3f2e52f6d9fcceaaeeee2283265";

const { publicClient } = configureChains(chains1, [w3mProvider({ projectId })]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains1 }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains1);
export const MainContext = createContext();

export default function RootLayout({ children, props }) {
  const [trigger, setTrigger] = useState(1);
  return (
    <>
      <html lang="en">
        <head>
          <title>Noundry Gallery</title>
          <link rel="icon" href="/favicon.ico" />
        </head>
        <body>
          <NextUIProvider>
            <MainContext.Provider value={{ trigger, setTrigger }}>
              <WagmiConfig config={wagmiConfig}>
                <NextThemesProvider attribute="class" defaultTheme="dark">
                  <Navbar />
                  {children}
                  <Footer />
                </NextThemesProvider>
              </WagmiConfig>
            </MainContext.Provider>
            <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
          </NextUIProvider>
        </body>
      </html>
    </>
  );
}
