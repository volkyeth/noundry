import { Trait } from "@/types/trait";
import { capitalize } from "../../../../utils/capitalize";
import { formatSubmissionType } from "@/utils/traits/format";

export interface ProposalImages<T> {
  previewNoun: T;
  circleCropLg: T;
  circleCropMd: T;
  circleCropSm: T;
  standalone: T;
  palette: T;
  galleryImages: T[];
}

export type ProposalImagesUris = ProposalImages<string>;

export type ProposalImagesBlobs = ProposalImages<Blob>;

export interface generateProposalContentProps {
  trait: Trait;
  proposalImages: ProposalImagesUris;
  wordsFromArtist: string;
  amountPaletteColors: number;
  artContributionAgreementSigner?: `0x${string}`;
  artContributionAgreementMessage: string;
  artContributionAgreementSignature?: `0x${string}`;
}

export const generateProposalContent = ({
  trait,
  proposalImages,
  wordsFromArtist,
  amountPaletteColors,
  artContributionAgreementSigner,
  artContributionAgreementMessage,
  artContributionAgreementSignature,
}: generateProposalContentProps) => {
  return `
# 🎨 Lil Noundry: Add ${trait.name} ${capitalize(formatSubmissionType(trait.type))}

*submitted via [Lil Noundry](https://lil.noundry.wtf/trait/${trait.id})*

## Summary
This proposal adds a new **${formatSubmissionType(trait.type)}** trait: ${trait.name}

Showcase Lil

![Showcase Lil](${proposalImages.previewNoun})

Trait artwork

![Trait artwork](${proposalImages.standalone})

Circle crop

![Circle crop](${proposalImages.circleCropLg})

![Circle crop](${proposalImages.circleCropMd})

![Circle crop](${proposalImages.circleCropSm})

Palette: ${amountPaletteColors} colors
![new part](${proposalImages.palette})

## Playground testing

Here are some auto-generated combinations of the new part with existing Lil Nouns parts:

${proposalImages.galleryImages
      .map((imageUri, i) => `![Preview ${i + 1}](${imageUri})`)
      .join("")}
  [see more previews](https://lil.noundry.wtf/trait/${trait.id})

  ${wordsFromArtist &&
    `## Some words from the artist

${wordsFromArtist}`
    }

  ## CC0 waiver
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
