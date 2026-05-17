import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { nounsDescriptorContract } from "../../noggles/src/nouns/contracts/nouns-descriptor.js";
import type { TraitNames } from "../../noggles/src/types/traits.js";

const alchemyApiKey =
  process.env.ALCHEMY_API_KEY || process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

export const rpcUrl =
  process.env.ETH_RPC_URL ||
  process.env.MAINNET_RPC_URL ||
  (alchemyApiKey ? `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : undefined) ||
  "https://ethereum-rpc.publicnode.com";

export const outputPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../src/image-data.json"
);

export const packageJsonPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../package.json"
);

export const traitNamesPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../noggles/src/nouns/traitNames.json"
);

export const displayTraitNamesPath = "packages/noggles/src/nouns/traitNames.json";

export const createMainnetPublicClient = () =>
  createPublicClient({
    chain: mainnet,
    transport: http(rpcUrl, {
      retryCount: 3,
      timeout: 60_000,
    }),
  });

export async function fetchTraitCounts(publicClient: ReturnType<typeof createMainnetPublicClient>) {
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
  } satisfies Record<keyof TraitNames, number>;
}

export async function ensureTraitNamesReady(
  onchainCounts: Record<keyof TraitNames, number>,
  absoluteTraitNamesPath: string,
  displayedTraitNamesPath: string
) {
  const traitNames = JSON.parse(await readFile(absoluteTraitNamesPath, "utf8")) as TraitNames;
  const extra = findExtraNames(traitNames, onchainCounts);
  if (extra.length > 0) {
    console.warn("");
    console.warn("TraitNames has more names than the expected descriptor count:");
    for (const item of extra) console.warn(`- ${item}`);
    console.warn(`Review ${displayedTraitNamesPath}, then rerun this command.`);
    return true;
  }

  const appended = appendMissingPlaceholders(traitNames, onchainCounts);

  if (appended.length > 0) {
    await writeFile(absoluteTraitNamesPath, `${JSON.stringify(traitNames, null, 2)}\n`);
    console.warn("");
    console.warn("Trait count mismatch detected. Added placeholder names:");
    for (const item of appended) console.warn(`- ${item}`);
    console.warn(`Update those placeholders in ${displayedTraitNamesPath}, then rerun this command.`);
    return true;
  }

  const placeholders = findPlaceholders(traitNames);
  if (placeholders.length > 0) {
    console.warn("");
    console.warn("Placeholder trait names still need real names:");
    for (const item of placeholders) console.warn(`- ${item}`);
    console.warn(`Update them in ${displayedTraitNamesPath}, then rerun this command.`);
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
      extra.push(`${category}: ${traitNames[category].length} names, ${counts[category]} expected`);
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

export async function bumpPackagePatchVersion(absolutePackageJsonPath: string) {
  const packageJson = JSON.parse(await readFile(absolutePackageJsonPath, "utf8")) as {
    version: string;
    [key: string]: unknown;
  };
  const previousVersion = packageJson.version;
  const nextVersion = nextPatchVersion(previousVersion);

  packageJson.version = nextVersion;
  await writeFile(absolutePackageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

  return { previousVersion, nextVersion };
}

function nextPatchVersion(version: string) {
  const parts = version.split(".");
  if (parts.length !== 3) {
    throw new Error(`Expected package version "${version}" to use x.y.z format.`);
  }

  const [major, minor, patch] = parts.map((part) => Number(part));
  if (![major, minor, patch].every(Number.isInteger)) {
    throw new Error(`Expected package version "${version}" to use numeric x.y.z format.`);
  }

  return `${major}.${minor}.${patch + 1}`;
}

export function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "shortMessage" in error) {
    return String(error.shortMessage);
  }

  if (error instanceof Error) return error.message;

  return String(error);
}
