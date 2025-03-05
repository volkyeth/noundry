"use client";

import { ImageData } from "@noundry/nouns-assets";
import { buildSVG } from "@nouns/sdk";
import { nounsTraitNames } from "noggles";
import { useMemo } from "react";

type TraitType = "backgrounds" | "bodies" | "accessories" | "heads" | "glasses";

const TraitImage = ({
  type,
  index,
  size = 36,
}: {
  type: TraitType;
  index: number;
  size?: number;
}) => {
  const svg = useMemo(() => {
    // Default values for all traits
    const defaultTraits = {
      accessory: 0,
      background: 0,
      body: 0,
      head: 0,
      glasses: 0,
    };

    // Override the specific trait we want to display
    const traits = {
      ...defaultTraits,
      [type === "backgrounds"
        ? "background"
        : type === "accessories"
        ? "accessory"
        : type.slice(0, -1)]: index,
    };

    // For backgrounds, we only need to show the background color
    if (type === "backgrounds") {
      const background = ImageData.bgcolors[index];
      return `data:image/svg+xml;base64,${btoa(
        buildSVG([], ImageData.palette, background)
      )}`;
    }

    // For other traits, we need to show the trait on a default background
    const parts = [];

    // Add the specific trait we want to display
    parts.push(ImageData.images[type][index]);

    const background = ImageData.bgcolors[traits.background];

    return `data:image/svg+xml;base64,${btoa(
      buildSVG(parts, ImageData.palette, background)
    )}`;
  }, [type, index]);

  return <img src={svg} className={`size-${size}`} alt="" />;
};

const TraitSection = ({ title, type }: { title: string; type: TraitType }) => {
  const traitNames = nounsTraitNames[type];
  const traitImages =
    type === "backgrounds" ? ImageData.bgcolors : ImageData.images[type];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {traitImages.map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <TraitImage type={type} index={index} />
            <span className="mt-2 text-sm text-center">
              {traitNames[index] || `${type.slice(0, -1)} ${index}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TraitsList = () => {
  return (
    <div className="flex flex-col gap-12 w-full">
      <TraitSection title="Backgrounds" type="backgrounds" />
      <TraitSection title="Bodies" type="bodies" />
      <TraitSection title="Accessories" type="accessories" />
      <TraitSection title="Heads" type="heads" />
      <TraitSection title="Glasses" type="glasses" />
    </div>
  );
};
