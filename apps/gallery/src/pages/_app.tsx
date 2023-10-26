"use client";

import { siweConfig } from "@/utils/siwe/siweConfig";
import "@fontsource-variable/inter";
import "@fontsource-variable/lora";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ConnectKitProvider, SIWEProvider, getDefaultConfig } from "connectkit";
import { AppProps } from "next/app";
import Head from "next/head";
import { WagmiConfig, createConfig, mainnet } from "wagmi";
import Navbar from "../components/Navbar";
import "../globals.css";

const config = createConfig({
  ...getDefaultConfig({
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID!,
    appName: "Noundry Gallery",
    chains: [mainnet],
  }),
});

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
            <NextUIProvider className="flex flex-col min-h-screen">
              <Head>
                <title>Noundry Gallery</title>
                <meta property="og:title" content="Noundry Gallery" />
                <meta property="og:site_name" content="Noundry Gallery" />
                <meta name="theme-color" content="#FF2165" />
                <meta property="twitter:card" content="summary_large_image" />
              </Head>
              <Navbar />
              <div className="flex-grow overflow-scroll">
                <Component {...pageProps} />
              </div>
            </NextUIProvider>
          </ConnectKitProvider>
        </SIWEProvider>
      </WagmiConfig>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
