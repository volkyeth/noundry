"use client";

import { siweConfig } from "@/utils/siwe/siweConfig";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, SIWEProvider, getDefaultConfig } from "connectkit";
import { AppProps } from "next/app";
import { WagmiConfig, createConfig, mainnet } from "wagmi";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import "../globals.css";

const config = createConfig(
  getDefaultConfig({
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID!,
    appName: "Noundry Gallery",
    chains: [mainnet],
  })
);

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <SIWEProvider {...siweConfig}>
          <ConnectKitProvider
            mode={"light"}
            options={{ enforceSupportedChains: false }}
          >
            <NextUIProvider className="flex flex-col min-h-full">
              <Navbar />
              <div className="flex-grow overflow-scroll">
                <Component {...pageProps} />
              </div>
              <Footer />
            </NextUIProvider>
          </ConnectKitProvider>
        </SIWEProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
