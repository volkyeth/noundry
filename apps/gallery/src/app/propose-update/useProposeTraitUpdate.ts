"use client";

import { useSimulateContract } from "wagmi";

import { useMainnetArtwork } from "@/hooks/useMainnetArtwork";
import { Trait } from "@/types/trait";
import { formatTraitType } from "@/utils/traits/format";
import {
    nounsDaoDataContract,
    nounsDescriptorContract,
    TraitCategory
} from "noggles";
import { useMemo } from "react";
import slugify from "slugify";
import { encodeFunctionData, getAbiItem, toFunctionSignature } from "viem";
import { compressEncodedArtwork, encodeArtwork } from "../propose/artworkEncoding";
import { useTraitColorIndexes } from "../propose/useTraitColorIndexes";

export interface UseProposeTraitUpdateArgs {
    description?: string;
    trait: Trait;
    isNouner?: boolean;
    createCandidateCost?: bigint;
    paletteIndex?: number;
    traitToUpdateIndex: number;
}

const getUpdatePartCallFunc = (traitType: TraitCategory) => {
    switch (traitType) {
        case "accessories":
            return "updateAccessories";
        case "bodies":
            return "updateBodies";
        case "heads":
            return "updateHeads";
        case "glasses":
            return "updateGlasses";
        case "backgrounds":
            throw new Error("Updating backgrounds is not supported");
        default:
            throw new Error(`Unsupported trait type: ${traitType}`);
    }
};

export const useProposeTraitUpdateSimulation = ({
    description,
    trait,
    paletteIndex,
    createCandidateCost,
    isNouner,
    traitToUpdateIndex,
}: UseProposeTraitUpdateArgs) => {
    const slug = useMemo(
        () => slugify(`Update ${trait.name} ${formatTraitType(trait.type)} ${(new Date()).toISOString().slice(0, 10)}`.toLowerCase()),
        [trait]
    );
    const { data: mainnetArtwork } = useMainnetArtwork();
    const palette = useMemo(
        () => mainnetArtwork?.palettes[paletteIndex ?? 0],
        [mainnetArtwork, paletteIndex]
    );
    const traitColorIndexes = useTraitColorIndexes(trait.trait, palette);

    const compressedEncodedArtwork = useMemo(() => {
        if (!traitColorIndexes || paletteIndex === undefined || !mainnetArtwork) return undefined;

        // Based on trait type, get all existing traits
        let existingTraits: `0x${string}`[] = [];

        // Create a function to encode a trait
        const encodeTraitFromArtwork = (pixels: number[], paletteIndex: number): `0x${string}` => {
            return encodeArtwork(32, 32, pixels, paletteIndex);
        };

        // Gather all existing traits from mainnet artwork
        switch (trait.type) {
            case 'accessories':
                existingTraits = mainnetArtwork.accessories.map((accessory, i) =>
                    i === traitToUpdateIndex && traitColorIndexes
                        ? encodeTraitFromArtwork(traitColorIndexes, paletteIndex)
                        : accessory
                );
                break;
            case 'bodies':
                existingTraits = mainnetArtwork.bodies.map((body, i) =>
                    i === traitToUpdateIndex && traitColorIndexes
                        ? encodeTraitFromArtwork(traitColorIndexes, paletteIndex)
                        : body
                );
                break;
            case 'heads':
                existingTraits = mainnetArtwork.heads.map((head, i) =>
                    i === traitToUpdateIndex && traitColorIndexes
                        ? encodeTraitFromArtwork(traitColorIndexes, paletteIndex)
                        : head
                );
                break;
            case 'glasses':
                existingTraits = mainnetArtwork.glasses.map((glasses, i) =>
                    i === traitToUpdateIndex && traitColorIndexes
                        ? encodeTraitFromArtwork(traitColorIndexes, paletteIndex)
                        : glasses
                );
                break;
            default:
                return undefined;
        }

        return compressEncodedArtwork(existingTraits);
    }, [traitColorIndexes, paletteIndex, mainnetArtwork, trait.type, traitToUpdateIndex]);

    const value = isNouner ? 0n : createCandidateCost ?? 0n;
    const functionName = getUpdatePartCallFunc(trait.type);
    const calldata = useMemo(() => {
        if (!compressedEncodedArtwork) return undefined;


        return encodeFunctionData({
            abi: nounsDescriptorContract.abi,
            functionName,
            args: compressedEncodedArtwork,
        }) as `0x${string}`;
    }, [compressedEncodedArtwork, trait, functionName]);


    const targets = [nounsDescriptorContract.address] as const;

    const signatures = useMemo(
        () => [
            toFunctionSignature(
                getAbiItem({ abi: nounsDescriptorContract.abi, name: functionName })
            ),
        ],
        [functionName]
    );

    const proposalIdToUpdate = 0n;

    return useSimulateContract({
        address: nounsDaoDataContract.address,
        abi: nounsDaoDataContract.abi,
        functionName: "createProposalCandidate",
        value,
        args: [
            targets,
            [0n],
            signatures,
            calldata ? [calldata] : [],
            description ?? "",
            slug,
            proposalIdToUpdate
        ] as any,
        query: {
            enabled: description !== undefined && compressedEncodedArtwork !== undefined && calldata !== undefined,
        },

    });
}; 