import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { toImageData } from "../../noggles/src/artwork/toImageData.js";
import { nounsDescriptorContract } from "../../noggles/src/nouns/contracts/nouns-descriptor.js";
import { fetchOnchainNounsArtData } from "../../noggles/src/nouns/fetchOnchainNounsArtData.js";
import { nounsTraitNames } from "../../noggles/src/nouns/traitNames.js";
import type { TraitNames } from "../../noggles/src/types/traits.js";

const alchemyApiKey = process.env.ALCHEMY_API_KEY || process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const rpcUrl =
  process.env.ETH_RPC_URL ||
  process.env.MAINNET_RPC_URL ||
  (alchemyApiKey ? `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : undefined) ||
  "https://ethereum-rpc.publicnode.com";

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(rpcUrl, {
    retryCount: 3,
    timeout: 60_000,
  }),
});

const outputPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../src/image-data.json"
);
const traitNamesPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../noggles/src/nouns/traitNames.json"
);

main().catch((error) => {
  console.error(getErrorMessage(error));
  console.error("Set ETH_RPC_URL, MAINNET_RPC_URL, ALCHEMY_API_KEY, or NEXT_PUBLIC_ALCHEMY_API_KEY if the default public RPC is too slow.");
  process.exitCode = 1;
});

async function main() {
  console.log("Checking Nouns trait counts from the descriptor contract...");

  const onchainCounts = await fetchTraitCounts();
  if (await ensureTraitNamesReady(onchainCounts, traitNamesPath, "packages/noggles/src/nouns/traitNames.json")) {
    process.exitCode = 1;
    return;
  }

  console.log("Fetching Nouns artwork from the descriptor contract...");

  const artData = await fetchOnchainNounsArtData(publicClient);

  await writeFile(
    outputPath,
    `${JSON.stringify(toImageData(artData, nounsTraitNames), null, 2)}\n`
  );

  console.log(`Updated ${outputPath}`);
}

async function fetchTraitCounts(): Promise<Record<keyof TraitNames, number>> {
  const [glasses, heads, accessories, bodies, backgrounds] = await publicClient.multicall({
    allowFailure: false,
    contracts: [
      { ...nounsDescriptorContract, functionName: "glassesCount" },
      { ...nounsDescriptorContract, functionName: "headCount" },
      { ...nounsDescriptorContract, functionName: "accessoryCount" },
      { ...nounsDescriptorContract, functionName: "bodyCount" },
      { ...nounsDescriptorContract, functionName: "backgroundCount" },
    ],
  });

  return {
    backgrounds: Number(backgrounds),
    bodies: Number(bodies),
    accessories: Number(accessories),
    heads: Number(heads),
    glasses: Number(glasses),
  };
}

async function ensureTraitNamesReady(
  onchainCounts: Record<keyof TraitNames, number>,
  absoluteTraitNamesPath: string,
  displayTraitNamesPath: string
) {
  const traitNames = JSON.parse(await readFile(absoluteTraitNamesPath, "utf8")) as TraitNames;
  const extra = findExtraNames(traitNames, onchainCounts);
  if (extra.length > 0) {
    console.warn("");
    console.warn("TraitNames has more names than the onchain descriptor count:");
    for (const item of extra) console.warn(`- ${item}`);
    console.warn(`Review ${displayTraitNamesPath}, then rerun this command.`);
    return true;
  }

  const appended = appendMissingPlaceholders(traitNames, onchainCounts);

  if (appended.length > 0) {
    await writeFile(absoluteTraitNamesPath, `${JSON.stringify(traitNames, null, 2)}\n`);
    console.warn("");
    console.warn("Trait count mismatch detected. Added placeholder names:");
    for (const item of appended) console.warn(`- ${item}`);
    console.warn(`Update those placeholders in ${displayTraitNamesPath}, then rerun this command.`);
    return true;
  }

  const placeholders = findPlaceholders(traitNames);
  if (placeholders.length > 0) {
    console.warn("");
    console.warn("Placeholder trait names still need real names:");
    for (const item of placeholders) console.warn(`- ${item}`);
    console.warn(`Update them in ${displayTraitNamesPath}, then rerun this command.`);
    return true;
  }

  return false;
}

function appendMissingPlaceholders(
  traitNames: TraitNames,
  counts: Record<keyof TraitNames, number>
) {
  const appended: string[] = [];

  for (const category of traitNameCategories) {
    const names = traitNames[category];
    while (names.length < counts[category]) {
      const placeholder = placeholderName(category, names.length);
      names.push(placeholder);
      appended.push(`${category}[${names.length - 1}] = "${placeholder}"`);
    }
  }

  return appended;
}

function findPlaceholders(traitNames: TraitNames) {
  const placeholders: string[] = [];

  for (const category of traitNameCategories) {
    traitNames[category].forEach((name, index) => {
      if (name === placeholderName(category, index)) {
        placeholders.push(`${category}[${index}] = "${name}"`);
      }
    });
  }

  return placeholders;
}

function findExtraNames(traitNames: TraitNames, counts: Record<keyof TraitNames, number>) {
  const extra: string[] = [];

  for (const category of traitNameCategories) {
    if (traitNames[category].length > counts[category]) {
      extra.push(`${category}: ${traitNames[category].length} names, ${counts[category]} onchain`);
    }
  }

  return extra;
}

const traitNameCategories = [
  "backgrounds",
  "bodies",
  "accessories",
  "heads",
  "glasses",
] as const satisfies readonly (keyof TraitNames)[];

function placeholderName(category: keyof TraitNames, index: number) {
  const prefixByCategory = {
    backgrounds: "background",
    bodies: "body",
    accessories: "accessory",
    heads: "head",
    glasses: "glasses",
  } satisfies Record<keyof TraitNames, string>;

  return `${prefixByCategory[category]}-${index}`;
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "shortMessage" in error) {
    return String(error.shortMessage);
  }

  if (error instanceof Error) return error.message;

  return String(error);
}
