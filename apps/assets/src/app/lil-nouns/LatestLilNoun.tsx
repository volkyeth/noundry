"use client";

import { getNounData, ImageData } from "@noundry/lil-nouns-assets";
import { buildSVG } from "@nouns/sdk";
import dynamic from "next/dynamic";
import { useMemo } from "react";

export const InnerLilNoun = () => {
  const svg = useMemo(() => {
    const { parts, background } = getNounData({
      accessory: ImageData.images.accessories.length - 1,
      background: ImageData.bgcolors.length - 1,
      body: ImageData.images.bodies.length - 1,
      head: ImageData.images.heads.length - 1,
      glasses: ImageData.images.glasses.length - 1,
    });

    return `data:image/svg+xml;base64,${btoa(
      buildSVG(parts, ImageData.palette, background)
    )}`;
  }, []);
  return <img src={svg} className="size-36" />;
};

export const LatestLilNoun = dynamic(() => Promise.resolve(InnerLilNoun), {
  ssr: false,
});
