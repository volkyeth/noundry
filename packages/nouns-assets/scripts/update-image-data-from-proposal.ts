import { readFile, writeFile } from "node:fs/promises";
import { decodeAbiParameters, decodeFunctionData, getAbiItem, type Hex } from "viem";
import { decodeTrait } from "../../noggles/src/artwork/decodeTrait.js";
import { deflateTraits } from "../../noggles/src/artwork/deflateTraits.js";
import { inflateTraits } from "../../noggles/src/artwork/inflateTraits.js";
import { toImageData } from "../../noggles/src/artwork/toImageData.js";
import {
  nounsDaoDataContract,
} from "../../noggles/src/nouns/contracts/nouns-dao-data.js";
import {
  nounsDescriptorContract,
  nounsDescriptorContractAddress,
} from "../../noggles/src/nouns/contracts/nouns-descriptor.js";
import { fetchOnchainNounsArtData } from "../../noggles/src/nouns/fetchOnchainNounsArtData.js";
import { nounsTraitNames } from "../../noggles/src/nouns/traitNames.js";
import type { EncodedTrait, HexColor, NounsArtData, Palette } from "../../noggles/src/types/artwork.js";
import type { TraitNames } from "../../noggles/src/types/traits.js";
import {
  bumpPackagePatchVersion,
  createMainnetPublicClient,
  displayTraitNamesPath,
  ensureTraitNamesReady,
  fetchTraitCounts,
  getErrorMessage,
  outputPath,
  packageJsonPath,
  traitNamesPath,
} from "./update-image-data-utils.js";

type ProposalCategory = "bodies" | "accessories" | "heads" | "glasses";

type ImageDataJson = {
  bgcolors: string[];
  palette: string[];
  images: {
    bodies: { filename: string; data: EncodedTrait }[];
    accessories: { filename: string; data: EncodedTrait }[];
    heads: { filename: string; data: EncodedTrait }[];
    glasses: { filename: string; data: EncodedTrait }[];
  };
};

type ProposalAction = {
  category: ProposalCategory;
  functionName: keyof typeof categoryByFunctionName;
  traits: EncodedTrait[];
};

const publicClient = createMainnetPublicClient();

const nounsGovernorAbi = [
  {
    type: "function",
    stateMutability: "view",
    name: "getActions",
    inputs: [{ name: "proposalId", type: "uint256" }],
    outputs: [
      { name: "targets", type: "address[]" },
      { name: "values", type: "uint256[]" },
      { name: "signatures", type: "string[]" },
      { name: "calldatas", type: "bytes[]" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    name: "proposals",
    inputs: [{ name: "proposalId", type: "uint256" }],
    outputs: [
      { name: "id", type: "uint256" },
      { name: "proposer", type: "address" },
      { name: "proposalThreshold", type: "uint256" },
      { name: "quorumVotes", type: "uint256" },
      { name: "eta", type: "uint256" },
      { name: "startBlock", type: "uint256" },
      { name: "endBlock", type: "uint256" },
      { name: "forVotes", type: "uint256" },
      { name: "againstVotes", type: "uint256" },
      { name: "abstainVotes", type: "uint256" },
      { name: "canceled", type: "bool" },
      { name: "vetoed", type: "bool" },
      { name: "executed", type: "bool" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    name: "state",
    inputs: [{ name: "proposalId", type: "uint256" }],
    outputs: [{ type: "uint8" }],
  },
] as const;

const categoryByFunctionName = {
  addAccessories: "accessories",
  addBodies: "bodies",
  addGlasses: "glasses",
  addHeads: "heads",
} as const satisfies Record<string, ProposalCategory>;

main().catch((error) => {
  console.error(getErrorMessage(error));
  console.error(
    "Set ETH_RPC_URL, MAINNET_RPC_URL, ALCHEMY_API_KEY, or NEXT_PUBLIC_ALCHEMY_API_KEY if the default public RPC is too slow."
  );
  process.exitCode = 1;
});

async function main() {
  const proposalId = parseProposalId(process.argv.slice(2));

  console.log(`Checking proposal ${proposalId} and current Nouns descriptor state...`);

  const currentImageData = await readFile(outputPath, "utf8");
  const currentSnapshot = JSON.parse(currentImageData) as ImageDataJson;
  const currentArtData = imageDataJsonToArtData(currentSnapshot);

  const [onchainCounts, onchainArtData, proposalData] = await Promise.all([
    fetchTraitCounts(publicClient),
    fetchOnchainNounsArtData(publicClient),
    fetchProposalData(proposalId),
  ]);

  ensureProposalQueued(proposalId, proposalData.state);
  validateSnapshotAgainstOnchain(currentArtData, onchainArtData, onchainCounts);

  const proposalActions = extractProposalActions(proposalData.actions, onchainArtData.palettes);
  const nextArtData = mergeProposalTraitsIntoSnapshot(
    currentArtData,
    proposalActions,
    onchainCounts
  );

  const projectedCounts = getArtDataCounts(nextArtData);
  if (
    await ensureTraitNamesReady(projectedCounts, traitNamesPath, displayTraitNamesPath)
  ) {
    process.exitCode = 1;
    return;
  }

  const nextImageData = `${JSON.stringify(toImageData(nextArtData, nounsTraitNames), null, 2)}\n`;
  if (currentImageData === nextImageData) {
    console.log(
      `Proposal ${proposalId} is already reflected in ${outputPath}; package version unchanged.`
    );
    return;
  }

  await writeFile(outputPath, nextImageData);
  const { previousVersion, nextVersion } = await bumpPackagePatchVersion(packageJsonPath);

  console.log(
    `Queued proposal ${proposalId} eta: ${formatEta(proposalData.eta)}`
  );
  for (const action of proposalActions) {
    console.log(
      `- ${action.functionName}: ${action.traits.length} ${action.category} trait${action.traits.length === 1 ? "" : "s"}`
    );
  }
  console.log(`Updated ${outputPath}`);
  console.log(`Bumped package version ${previousVersion} -> ${nextVersion}`);
}

function parseProposalId(args: string[]) {
  const proposalArg =
    args[0] === "--proposal" ? args[1] :
    args.find((arg) => arg.startsWith("--proposal="))?.split("=")[1] ??
    args[0];

  if (!proposalArg || !/^\d+$/.test(proposalArg)) {
    throw new Error(
      "Expected a proposal number. Usage: pnpm --filter @noundry/nouns-assets update:image-data:proposal 966"
    );
  }

  return BigInt(proposalArg);
}

async function fetchProposalData(proposalId: bigint) {
  const governorAddress = await publicClient.readContract({
    ...nounsDaoDataContract,
    functionName: "nounsDao",
  });

  const [state, actions, proposal] = await Promise.all([
    publicClient.readContract({
      address: governorAddress,
      abi: nounsGovernorAbi,
      functionName: "state",
      args: [proposalId],
    }),
    publicClient.readContract({
      address: governorAddress,
      abi: nounsGovernorAbi,
      functionName: "getActions",
      args: [proposalId],
    }),
    publicClient.readContract({
      address: governorAddress,
      abi: nounsGovernorAbi,
      functionName: "proposals",
      args: [proposalId],
    }),
  ]);

  return { state: Number(state), actions, eta: proposal[4] };
}

function ensureProposalQueued(proposalId: bigint, state: number) {
  if (state !== 5) {
    throw new Error(
      `Proposal ${proposalId} must be queued for execution. Current state: ${proposalStateLabel(state)} (${state}).`
    );
  }
}

function extractProposalActions(
  actions: Awaited<ReturnType<typeof fetchProposalData>>["actions"],
  palettes: Palette[]
) {
  const [targets, _values, signatures, calldatas] = actions;
  const extracted: ProposalAction[] = [];

  for (let index = 0; index < targets.length; index++) {
    if (targets[index]?.toLowerCase() !== nounsDescriptorContractAddress.toLowerCase()) {
      continue;
    }

    const decoded = decodeDescriptorTraitAction(signatures[index]!, calldatas[index]!, palettes);
    if (decoded) extracted.push(decoded);
  }

  if (extracted.length === 0) {
    throw new Error(
      "No Nouns descriptor trait-addition actions were found on that proposal."
    );
  }

  return extracted;
}

function decodeDescriptorTraitAction(
  signature: string,
  calldata: Hex,
  palettes: Palette[]
): ProposalAction | null {
  const decoded =
    signature.length > 0
      ? decodeActionFromSignature(signature, calldata)
      : decodeActionFromCalldata(calldata);

  if (!decoded) return null;

  const category = categoryByFunctionName[decoded.functionName];
  const [encodedCompressed, decompressedLength, imageCount] = decoded.args;
  const traits = inflateTraits(encodedCompressed);

  if (traits.length !== Number(imageCount)) {
    throw new Error(
      `${decoded.functionName} declares ${imageCount} trait(s) but inflates to ${traits.length}.`
    );
  }

  const reflated = deflateTraits(traits);
  if (
    reflated.originalLength !== decompressedLength ||
    reflated.traitCount !== Number(imageCount)
  ) {
    throw new Error(`${decoded.functionName} failed inflate payload validation.`);
  }

  for (const [index, trait] of traits.entries()) {
    const { paletteIndex } = decodeTrait(trait, 32, 32);
    if (!palettes[paletteIndex]) {
      throw new Error(
        `${decoded.functionName} trait ${index} references missing palette index ${paletteIndex}.`
      );
    }
  }

  return {
    category,
    functionName: decoded.functionName,
    traits,
  };
}

function decodeActionFromSignature(signature: string, calldata: Hex) {
  const functionName = signature.slice(0, signature.indexOf("("));
  if (!isSupportedFunctionName(functionName)) return null;

  const abiItem = getAbiItem({
    abi: nounsDescriptorContract.abi,
    name: functionName,
  });

  if (abiItem.type !== "function") return null;

  const args = decodeAbiParameters(abiItem.inputs, calldata);
  return {
    functionName,
    args: args as readonly [Hex, bigint, number],
  };
}

function decodeActionFromCalldata(calldata: Hex) {
  const decoded = decodeFunctionData({
    abi: nounsDescriptorContract.abi,
    data: calldata,
  });

  if (!isSupportedFunctionName(decoded.functionName)) return null;

  return {
    functionName: decoded.functionName,
    args: decoded.args as readonly [Hex, bigint, number],
  };
}

function isSupportedFunctionName(
  functionName: string
): functionName is keyof typeof categoryByFunctionName {
  return functionName in categoryByFunctionName;
}

function imageDataJsonToArtData(imageData: ImageDataJson): NounsArtData {
  return {
    backgrounds: imageData.bgcolors.map((color) => `#${color}` as HexColor),
    palettes: [
      imageData.palette.map((color, index) =>
        index === 0 ? "#00000000" : (`#${color}` as HexColor)
      ),
    ],
    bodies: imageData.images.bodies.map((trait) => trait.data),
    accessories: imageData.images.accessories.map((trait) => trait.data),
    heads: imageData.images.heads.map((trait) => trait.data),
    glasses: imageData.images.glasses.map((trait) => trait.data),
  };
}

function validateSnapshotAgainstOnchain(
  currentArtData: NounsArtData,
  onchainArtData: NounsArtData,
  onchainCounts: Record<keyof TraitNames, number>
) {
  if (JSON.stringify(currentArtData.palettes[0]) !== JSON.stringify(onchainArtData.palettes[0])) {
    throw new Error(
      `${outputPath} palette does not match the live descriptor palette. Run update:image-data first or reconcile the local snapshot.`
    );
  }

  validatePrefix("backgrounds", currentArtData.backgrounds, onchainArtData.backgrounds, onchainCounts.backgrounds);
  validatePrefix("bodies", currentArtData.bodies, onchainArtData.bodies, onchainCounts.bodies);
  validatePrefix("accessories", currentArtData.accessories, onchainArtData.accessories, onchainCounts.accessories);
  validatePrefix("heads", currentArtData.heads, onchainArtData.heads, onchainCounts.heads);
  validatePrefix("glasses", currentArtData.glasses, onchainArtData.glasses, onchainCounts.glasses);
}

function validatePrefix(
  label: string,
  current: readonly string[],
  onchain: readonly string[],
  onchainCount: number
) {
  if (current.length < onchainCount) {
    throw new Error(
      `${outputPath} has only ${current.length} ${label}, but onchain has ${onchainCount}. Run update:image-data first.`
    );
  }

  for (let index = 0; index < onchainCount; index++) {
    if (current[index] !== onchain[index]) {
      throw new Error(
        `${outputPath} diverges from onchain ${label} at index ${index}. Run update:image-data first or reconcile the local snapshot.`
      );
    }
  }
}

function mergeProposalTraitsIntoSnapshot(
  currentArtData: NounsArtData,
  proposalActions: ProposalAction[],
  onchainCounts: Record<keyof TraitNames, number>
) {
  const nextArtData: NounsArtData = {
    backgrounds: [...currentArtData.backgrounds],
    palettes: currentArtData.palettes.map((palette) => [...palette]),
    bodies: [...currentArtData.bodies],
    accessories: [...currentArtData.accessories],
    heads: [...currentArtData.heads],
    glasses: [...currentArtData.glasses],
  };

  const proposedTraitsByCategory = groupProposalTraitsByCategory(proposalActions);

  for (const category of proposalCategories) {
    const proposedTraits = proposedTraitsByCategory[category];
    if (proposedTraits.length === 0) continue;

    const existingPendingTraits = nextArtData[category].slice(onchainCounts[category]);
    if (hasSequence(existingPendingTraits, proposedTraits)) continue;

    nextArtData[category].push(...proposedTraits);
  }

  return nextArtData;
}

function groupProposalTraitsByCategory(proposalActions: ProposalAction[]) {
  const grouped = {
    bodies: [] as EncodedTrait[],
    accessories: [] as EncodedTrait[],
    heads: [] as EncodedTrait[],
    glasses: [] as EncodedTrait[],
  };

  for (const action of proposalActions) {
    grouped[action.category].push(...action.traits);
  }

  return grouped;
}

function hasSequence(haystack: readonly EncodedTrait[], needle: readonly EncodedTrait[]) {
  if (needle.length === 0) return true;
  if (needle.length > haystack.length) return false;

  for (let start = 0; start <= haystack.length - needle.length; start++) {
    let matches = true;

    for (let offset = 0; offset < needle.length; offset++) {
      if (haystack[start + offset] !== needle[offset]) {
        matches = false;
        break;
      }
    }

    if (matches) return true;
  }

  return false;
}

function getArtDataCounts(artData: NounsArtData) {
  return {
    backgrounds: artData.backgrounds.length,
    bodies: artData.bodies.length,
    accessories: artData.accessories.length,
    heads: artData.heads.length,
    glasses: artData.glasses.length,
  } satisfies Record<keyof TraitNames, number>;
}

function proposalStateLabel(state: number) {
  const labels = [
    "Pending",
    "Active",
    "Canceled",
    "Defeated",
    "Succeeded",
    "Queued",
    "Expired",
    "Executed",
    "Vetoed",
    "ObjectionPeriod",
    "Updatable",
    "PendingConstitutionalVote",
    "ObjectionPeriodExecuted",
    "VetoedWithUpgrade",
  ];

  return labels[state] ?? "Unknown";
}

function formatEta(eta: bigint) {
  if (eta === 0n) return "not set";
  return new Date(Number(eta) * 1000).toISOString();
}

const proposalCategories = [
  "bodies",
  "accessories",
  "heads",
  "glasses",
] as const satisfies readonly ProposalCategory[];
