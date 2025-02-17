"use client";

import { getNounData, ImageData } from "@noundry/nouns-assets";
import { buildSVG } from "@nouns/sdk";
import dynamic from "next/dynamic";
import { useMemo } from "react";

export const InnerNoun = () => {
  const svg = useMemo(() => {
    const { parts, background } = getNounData({
      accessory: 0,
      background: 0,
      body: 30,
      head: 0,
      glasses: 0,
    });

    return `data:image/svg+xml;base64,${btoa(
      buildSVG(parts, ImageData.palette, background)
    )}`;
  }, []);
  return <img src={svg} className="size-36" />;
};

export const Noun = dynamic(() => Promise.resolve(InnerNoun), {
  ssr: false,
});
