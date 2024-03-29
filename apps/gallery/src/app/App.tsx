"use client";

import Footer from "@/components/Footer";
import { SiweCordProvider } from "@/components/SiweCordProvider";
import { siweConfig } from "@/utils/siwe/siweConfig";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Analytics } from "@vercel/analytics/react";
import { ConnectKitProvider, SIWEProvider, getDefaultConfig } from "connectkit";
import NextNProgress from "nextjs-progressbar";
import { ReactNode } from "react";
import { WagmiConfig, createConfig, mainnet } from "wagmi";
import Navbar from "../components/Navbar";

export const App = ({ children }: { children: ReactNode }) => {
  const config = createConfig({
    ...getDefaultConfig({
      alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!,
      walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID!,
      appName: "Noundry Gallery",
      chains: [mainnet],
    }),
  });

  const queryClient = new QueryClient();

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
                <NextNProgress
                  color="#FF2165"
                  height={2}
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
          </SiweCordProvider>
        </SIWEProvider>
      </WagmiConfig>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
