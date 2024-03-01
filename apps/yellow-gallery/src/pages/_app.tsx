"use client";

import Footer from "@/components/Footer";
import { SiweCordProvider } from "@/components/SiweCordProvider";
import { SITE_URI } from "@/constants/config";
import { siweConfig } from "@/utils/siwe/siweConfig";
import "@fontsource-variable/inter";
import "@fontsource-variable/lora";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Analytics } from "@vercel/analytics/react";
import { ConnectKitProvider, SIWEProvider, getDefaultConfig } from "connectkit";
import { AppProps } from "next/app";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import { WagmiConfig, createConfig, mainnet } from "wagmi";
import Navbar from "../components/Navbar";
import "../globals.css";

const config = createConfig({
  ...getDefaultConfig({
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID!,
    appName: "Yellow Noundry",
    chains: [mainnet],
  }),
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <SIWEProvider {...siweConfig}>
          <SiweCordProvider>
            <ConnectKitProvider
              mode={"light"}
              options={{ enforceSupportedChains: false }}
            >
              <NextUIProvider className="flex flex-col min-h-screen">
                <Head>
                  <title>Yellow Noundry</title>
                  <meta key="title" name="title" content="Yellow Noundry" />

                  <meta
                    key="og:title"
                    name="og:title"
                    content="Yellow Noundry"
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

                  <meta name="og:site_name" content="Yellow Noundry" />
                  <meta name="theme-color" content="#FBCB07" />
                  <meta name="twitter:card" content="summary_large_image" />
                </Head>
                <NextNProgress
                  color="#FBCB07"
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
          </SiweCordProvider>
        </SIWEProvider>
      </WagmiConfig>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
