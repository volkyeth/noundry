"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

import { siweConfig } from "@/utils/siwe/siweConfig";
import { appConfig } from "@/variants/config";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Analytics } from "@vercel/analytics/react";
import { ConnectKitProvider, SIWEProvider, getDefaultConfig } from "connectkit";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactNode } from "react";
import { mainnet } from "viem/chains";
import { WagmiProvider, createConfig, fallback, http } from "wagmi";
import { hashFn } from "wagmi/query";

// Get the primary color for the current variant
const getPrimaryColor = () => {
  return appConfig.variant === "nouns" ? "#FF2165" : "#1e92d9";
};

export const App = ({ children }: { children: ReactNode }) => {
  const config = createConfig(
    getDefaultConfig({
      chains: [mainnet],
      transports: {
        [mainnet.id]: fallback([
          http(
            `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
          ),
          http(),
        ]),
      },
      walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID!,
      appName: appConfig.appTitle,
    }),
  );

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: hashFn,
      },
    },
  });

  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <SIWEProvider {...siweConfig}>
            <ConnectKitProvider
              mode={"light"}
              options={{ enforceSupportedChains: false }}
            >
              <NextUIProvider className="flex flex-col min-h-screen">
                <ProgressBar
                  color={getPrimaryColor()}
                  height={"2px"}
                  options={{ showSpinner: false }}
                />
                <Navbar />
                <div className="flex-grow overflow-auto">
                  {children}
                  <Analytics />
                </div>
                <Footer />
              </NextUIProvider>
            </ConnectKitProvider>
          </SIWEProvider>
        </WagmiProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </NuqsAdapter>
  );
};
