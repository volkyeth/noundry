import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Noundry assets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <head>
        <script src="/lil-nouns/image-data.js" />
      </head>
      <body>{children}</body>
    </>
  );
}
