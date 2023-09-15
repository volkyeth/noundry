import loadingNounSmall from "@/assets/loading-noun-smaller.gif";
import loadingNoun from "@/assets/loading-noun.gif";
import { Button, FormControl, FormHelperText, FormLabel, Input, SimpleGrid, StackProps, Text, Textarea, VStack } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { AMOUNT_PROPOSAL_GALLERY_IMAGES } from "../constants/proposal";
import { useProposalState } from "../model/Proposal";
import { NounPartType } from "../types/noun";
import { generateProposalContent } from "../utils/propose/generateProposalContent";
import { ProposalImages, generateProposalImages } from "../utils/propose/generateProposalImages";
import { ProposalPreview } from "./ProposalPreview";

export interface ProposePartProps extends StackProps {
  partType: NounPartType;
  partBitmap: ImageBitmap;
}

export const ProposePart: FC<ProposePartProps> = ({ partType, partBitmap }) => {
  const {
    setPartBitmap,
    setPartName,
    partName,
    setProofOfNounishnessUrl,
    proofOfNounishnessUrl,
    provenanceUrl,
    setprovenanceUrl,
    setWordsFromArtist,
    wordsFromArtist,
  } = useProposalState();
  useEffect(() => {
    if (!partBitmap) return;
    generateProposalImages(partType, partBitmap).then(setProposalImages);
  }, [partBitmap]);

  const [proposalImages, setProposalImages] = useState<ProposalImages>({
    galleryImages: new Array(AMOUNT_PROPOSAL_GALLERY_IMAGES).fill(loadingNounSmall),
    editionImage: loadingNoun,
    mainImage: loadingNoun,
  });
  const [description, setDescription] = useState("Loading...");

  console.log({ description });

  useEffect(() => {
    generateProposalContent(partType, partName, proposalImages, wordsFromArtist, proofOfNounishnessUrl, provenanceUrl).then(setDescription);
  }, [partBitmap, partName, proofOfNounishnessUrl, provenanceUrl, wordsFromArtist, proposalImages]);
  return (
    <VStack align={"start"} bgColor="gray.900" color="gray.100" h="full" w="full" overflowY={"hidden"} p={10} spacing={10}>
      <Button onClick={() => setPartBitmap(null)}>← Back</Button>

      <SimpleGrid templateColumns={"repeat(2,1fr)"} columnGap={10} h="full" mb={2} overflow={"hidden"}>
        <VStack spacing={8} overflowY={"scroll"}>
          <FormControl textAlign={"left"} isRequired isInvalid={partName.length === 0}>
            <FormLabel>Name your {partType}</FormLabel>
            <Input value={partName} placeholder="Foo" maxW={"md"} textAlign={"left"} onChange={(e) => setPartName(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Provenance</FormLabel>
            <Input
              type="url"
              value={provenanceUrl}
              fontSize={"xs"}
              placeholder="https://discord.com/channels/1007384786651852973/1019558246568181780/1115053713334210762"
              textAlign={"left"}
              onChange={(e) => setprovenanceUrl(e.target.value)}
            />
            <FormHelperText textAlign={"left"}>Include a link that shows the first appearance of your artwork</FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>Proof of Nounishness</FormLabel>
            <Input
              type="url"
              value={proofOfNounishnessUrl}
              fontSize={"xs"}
              placeholder="https://nouns.wtf"
              textAlign={"left"}
              onChange={(e) => setProofOfNounishnessUrl(e.target.value)}
            />
            <FormHelperText textAlign={"left"}>Include a link that shows the community approval of your art</FormHelperText>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Words from the artist</FormLabel>
            <Textarea
              rows={10}
              placeholder="Something, something, ⌐◨‒◨"
              resize={"none"}
              value={wordsFromArtist}
              textAlign={"left"}
              onChange={(e) => setWordsFromArtist(e.target.value)}
            />
            <FormHelperText textAlign={"left"}>Say a few words about your art. Markdown accepted</FormHelperText>
          </FormControl>
          <Button w={"full"} colorScheme="pink" size={"lg"}>
            Submit
          </Button>
        </VStack>
        <VStack align={"start"} h="full" overflow={"hidden"}>
          <Text>Proposal Preview:</Text>
          <ProposalPreview description={description} overflowY={"scroll"} />
        </VStack>
      </SimpleGrid>
    </VStack>
  );
};
