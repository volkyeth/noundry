import { SITE_URI } from "@/constants/config";
import { appConfig } from "@/variants/config";
import "@fontsource-variable/inter";
import "@fontsource-variable/lora";
import { Metadata } from "next";
import "../globals.css";
import { App } from "./App";

// Get the primary color for the current variant
const getPrimaryColor = () => {
  return appConfig.variant === "nouns" ? "#FF2165" : "#1e92d9";
};

export const metadata: Metadata = {
  title: appConfig.appTitle,
  icons: [
    {
      rel: "icon",
      url: appConfig.favicon.src,
    },
  ],
  description: `Let there be ${appConfig.nounTermPlural}.`,
  other: {
    "twitter:image": `${SITE_URI}/${appConfig.variant}-og.png`,
    "twitter:card": "summary_large_image",
    "theme-color": getPrimaryColor(),
  },
  openGraph: {
    title: appConfig.appTitle,
    description: `Let there be ${appConfig.nounTermPlural}.`,
    images: [
      {
        url: `${SITE_URI}/${appConfig.variant}-og.png`,
      },
    ],
    siteName: appConfig.appTitle,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>
          <App>{children}</App>
        </main>
      </body>
    </html>
  );
}
