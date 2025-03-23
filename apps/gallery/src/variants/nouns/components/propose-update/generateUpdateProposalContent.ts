import { Trait } from "@/types/trait";
import { titleCase } from "@/utils/titleCase";
import { formatTraitType } from "@/utils/traits/format";

export interface UpdateProposalImages<T> {
    oldStandalone: T;
    newStandalone: T;
    oldPalette: T;
    newPalette: T;
    galleryImages: T[]; // Will alternate between old and new trait versions
}

export type UpdateProposalImagesUris = UpdateProposalImages<string>;

export type UpdateProposalImagesBlobs = UpdateProposalImages<Blob>;

export interface generateUpdateProposalContentProps {
    trait: Trait;
    proposalImages: UpdateProposalImagesUris;
    wordsFromArtist: string;
    amountOldPaletteColors: number;
    amountNewPaletteColors: number;
    originalTraitName: string;
    originalTraitIndex: number;
    artContributionAgreementSigner?: `0x${string}`;
    artContributionAgreementMessage: string;
    artContributionAgreementSignature?: `0x${string}`;
    customTitle?: string;
}

export const generateUpdateProposalContent = ({
    trait,
    proposalImages,
    wordsFromArtist,
    amountOldPaletteColors,
    amountNewPaletteColors,
    originalTraitName,
    originalTraitIndex,
    artContributionAgreementSigner,
    artContributionAgreementMessage,
    artContributionAgreementSignature,
    customTitle,
}: generateUpdateProposalContentProps) => {
    const title = customTitle ?
        `🎨 Noundry: ${customTitle}` :
        `🎨 Noundry: Update ${titleCase(originalTraitName)} ${formatTraitType(trait.type)}`;

    return `
# ${title}

*submitted via [Noundry Gallery](https://gallery.noundry.wtf/trait/${trait.id})*

## Summary
This proposal updates an existing ${formatTraitType(trait.type)} trait: ${titleCase(originalTraitName)}

## Before & After Comparison

Old
![Old trait](${proposalImages.oldStandalone})
${amountOldPaletteColors} colors
![old part pallette](${proposalImages.oldPalette})

New 
![New trait](${proposalImages.newStandalone})
${amountNewPaletteColors} colors
![new part pallette](${proposalImages.newPalette})

## Playground testing

Here are some auto-generated combinations of the updated part with existing Nouns parts, comparing the old and new trait:

${proposalImages.galleryImages
            .map((imageUri, i) => i % 2 === 0 ? `![Old Preview ${Math.floor(i / 2) + 1}](${imageUri})` : `![New Preview ${Math.floor(i / 2) + 1}](${imageUri})`)
            .join("")}
  [see more previews](https://gallery.noundry.wtf/trait/${trait.id})

  ${wordsFromArtist &&
        `## Some words from the artist

${wordsFromArtist}`
        }

  ## Nouns Art Contribution Agreement

  **Signer**:
  \`\`\`
  ${artContributionAgreementSigner ?? "connect your wallet"}
  \`\`\`

  **Message**:
  \`\`\`
  ${artContributionAgreementMessage}
  \`\`\`

  **Signature**:
  \`\`\`
  ${artContributionAgreementSignature ?? "pending signature"}
  \`\`\`

  You can verify the signature using [Etherscan](https://etherscan.io/verifiedSignatures) or any other [EIP-191](https://eips.ethereum.org/EIPS/eip-191) verification tool
`;
}; 