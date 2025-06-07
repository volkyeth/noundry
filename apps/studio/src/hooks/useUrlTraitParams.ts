import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { NounPartType } from "../types/noun";
import { amountOfParts, getRandomSeed } from "../utils/nounAssets";

export type TraitParam = {
  type: 'seed';
  value: number;
} | {
  type: 'imageUri';
  value: string;
};

export type TraitParams = {
  [K in NounPartType]?: TraitParam;
};

export type UrlParams = {
  traitParams: TraitParams;
  remixedFrom?: string;
  remixedPart?: NounPartType;
};

export const useUrlTraitParams = (): UrlParams => {
  const [searchParams] = useSearchParams();

  return useMemo(() => {
    const params: TraitParams = {};
    const traitTypes: NounPartType[] = ['background', 'accessory', 'head', 'glasses', 'body'];

    for (const traitType of traitTypes) {
      const paramValue = searchParams.get(traitType);

      if (!paramValue) {
        // No parameter provided - this will be handled by initializeWithParams
        continue;
      }

      // Check if it's a URL (starts with http:// or https:// or data:)
      // For data URIs, we need to URL decode them since they contain special characters
      if (paramValue.startsWith('http://') || paramValue.startsWith('https://') || paramValue.startsWith('data:')) {
        const decodedValue = paramValue.startsWith('data:') ? decodeURIComponent(paramValue) : paramValue;
        params[traitType] = {
          type: 'imageUri',
          value: decodedValue
        };
        continue;
      }

      // Try to parse as a number
      const seedNumber = parseInt(paramValue, 10);
      if (!isNaN(seedNumber)) {
        // Check if seed is in valid range
        const maxParts = amountOfParts(traitType);
        if (seedNumber >= 0 && seedNumber < maxParts) {
          params[traitType] = {
            type: 'seed',
            value: seedNumber
          };
        } else {
          // Out of range, use random
          params[traitType] = {
            type: 'seed',
            value: getRandomSeed(traitType)
          };
        }
      } else {
        // Invalid parameter format, use random
        params[traitType] = {
          type: 'seed',
          value: getRandomSeed(traitType)
        };
      }
    }

    // Get remixedFrom parameter
    const remixedFrom = searchParams.get('remixedFrom') || undefined;
    
    // Get remixedPart parameter
    const remixedPartParam = searchParams.get('remixedPart');
    const remixedPart = remixedPartParam && traitTypes.includes(remixedPartParam as NounPartType) 
      ? remixedPartParam as NounPartType 
      : undefined;

    return {
      traitParams: params,
      remixedFrom,
      remixedPart
    };
  }, [searchParams]);
};