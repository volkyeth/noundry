import { readFile, writeFile } from "node:fs/promises";
import { toImageData } from "../../noggles/src/artwork/toImageData.js";
import { fetchOnchainNounsArtData } from "../../noggles/src/nouns/fetchOnchainNounsArtData.js";
import { nounsTraitNames } from "../../noggles/src/nouns/traitNames.js";
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

const publicClient = createMainnetPublicClient();

main().catch((error) => {
  console.error(getErrorMessage(error));
  console.error("Set ETH_RPC_URL, MAINNET_RPC_URL, ALCHEMY_API_KEY, or NEXT_PUBLIC_ALCHEMY_API_KEY if the default public RPC is too slow.");
  process.exitCode = 1;
});

async function main() {
  console.log("Checking Nouns trait counts from the descriptor contract...");

  const onchainCounts = await fetchTraitCounts(publicClient);
  if (await ensureTraitNamesReady(onchainCounts, traitNamesPath, displayTraitNamesPath)) {
    process.exitCode = 1;
    return;
  }

  console.log("Fetching Nouns artwork from the descriptor contract...");

  const artData = await fetchOnchainNounsArtData(publicClient);
  const nextImageData = `${JSON.stringify(toImageData(artData, nounsTraitNames), null, 2)}\n`;
  const currentImageData = await readFile(outputPath, "utf8");

  if (currentImageData === nextImageData) {
    console.log(`No changes detected in ${outputPath}; package version unchanged.`);
    return;
  }

  await writeFile(outputPath, nextImageData);
  const { previousVersion, nextVersion } = await bumpPackagePatchVersion(packageJsonPath);
  console.log(`Updated ${outputPath}`);
  console.log(`Bumped package version ${previousVersion} -> ${nextVersion}`);
}
