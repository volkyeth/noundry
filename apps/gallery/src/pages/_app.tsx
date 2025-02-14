"use client";

import Footer from "@/components/Footer";
import { SITE_URI } from "@/constants/config";
import { siweConfig } from "@/utils/siwe/siweConfig";
import "@fontsource-variable/inter";
import "@fontsource-variable/lora";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Analytics } from "@vercel/analytics/react";
import { ConnectKitProvider, getDefaultConfig, SIWEProvider } from "connectkit";
import { AppProps } from "next/app";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import { createConfig, http, WagmiProvider } from "wagmi";
import { mainnet } from "wagmi/chains";
import Navbar from "../components/Navbar";
import "../globals.css";

const config = createConfig(
  getDefaultConfig({
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID!,
    appName: "Noundry Gallery",
    chains: [mainnet],
    transports: {
      [mainnet.id]: http(
        `https://eth-mainnet.g.alchemy.com/v2/${process.env
          .NEXT_PUBLIC_ALCHEMY_API_KEY!}`
      ),
    },
  })
);

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <SIWEProvider {...siweConfig}>
          <ConnectKitProvider
            mode={"light"}
            options={{ enforceSupportedChains: false }}
          >
            <NextUIProvider className="flex flex-col min-h-screen">
              <Head>
                <title>Noundry Gallery</title>
                <meta key="title" name="title" content="Noundry Gallery" />

                <meta
                  key="og:title"
                  name="og:title"
                  content="Noundry Gallery"
                />

                <meta
                  key="description"
                  name="description"
                  content="Let there be Nouns."
                />

                <meta
                  key="og:description"
                  name="og:description"
                  content="Let there be Nouns."
                />

                <meta
                  key="og:image"
                  name="og:image"
                  content={`${SITE_URI}/og.png`}
                />

                <meta
                  key="twitter:image"
                  name="twitter:image"
                  content={`${SITE_URI}/og.png`}
                />

                <meta name="og:site_name" content="Noundry Gallery" />
                <meta name="theme-color" content="#FF2165" />
                <meta name="twitter:card" content="summary_large_image" />
              </Head>
              <NextNProgress
                color="#FF2165"
                height={2}
                options={{ showSpinner: false }}
              />
              <Navbar />
              <div className="flex-grow overflow-auto">
                <Component {...pageProps} />
                <Analytics />
              </div>
              <Footer />
            </NextUIProvider>
          </ConnectKitProvider>
        </SIWEProvider>
      </WagmiProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
