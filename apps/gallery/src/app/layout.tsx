import { SITE_URI } from "@/constants/config";
import "@fontsource-variable/inter";
import "@fontsource-variable/lora";
import { Metadata } from "next";
import "../globals.css";
import { App } from "./App";

export const metadata: Metadata = {
  title: "Noundry Gallery",
  description: "Let there be Nouns.",
  other: {
    "twitter:image": `${SITE_URI}/og.png`,
    "twitter:card": "summary_large_image",
    "theme-color": "#FF2165",
  },
  openGraph: {
    title: "Noundry Gallery",
    description: "Let there be Nouns.",
    images: [
      {
        url: `${SITE_URI}/og.png`,
      },
    ],
    siteName: "Noundry Gallery",
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
