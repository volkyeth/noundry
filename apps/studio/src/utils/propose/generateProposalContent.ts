import { NounPartType } from "../../types/noun";
import { ProposalImages } from "./useProposalImages";

export const generateProposalContent = async (
  partType: NounPartType,
  partName: string,
  proposalImages: ProposalImages,
  wordsFromArtist: string,
  provenanceUrl?: string
) => {
  const partNameWithFallback = partName || "<NAME IT>";
  return `
# [Noundry] Add ${partType}: ${partNameWithFallback}

*This proposal was submitted via [propose.noundry.wtf](https://propose.noundry.wtf)*


This proposal **adds a new ${partType} trait: ${partNameWithFallback}**

![new part](${proposalImages.mainImage})

${
  provenanceUrl
    ? `Here is the [provenance of the artwork](${provenanceUrl}).

`
    : ""
}

**And here are some words from the artist:**

> ${wordsFromArtist.replace(/\n/g, "\n> ")}

## Playground testing

Here's some auto-generated combinations of the new part with existing Nouns parts:

${proposalImages.galleryImages
  .map((imageUri, i) => `![Preview ${i}](${imageUri})`)
  .join("")}

## Droposal

This prop is also a **droposal of a commemorative edition of the new part**.

![open edition](${proposalImages.editionImage})

**Name:** Noundry edition: ${partNameWithFallback} ${partType}
**Mint duration:** 7 days
**Price:** F(r)ee (Free mint with 0.000777 ETH Zora protocol fee)

The open edition will use [Zora Protocol Rewards](https://x.com/ourZORA/status/1687146881791791104) to compensate the 
artist and support further development of Noundry tooling:

- 0.000444ETH/mint to the artist
- 0.000111ETH/mint to Noundry
`;
};
