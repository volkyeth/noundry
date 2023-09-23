import {
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Link,
  SimpleGrid,
  Spinner,
  StackProps,
  Text,
  Textarea,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { formatEther } from "viem";
import { useAccount, useWaitForTransaction } from "wagmi";
import { useNounsDataCreateCandidateCost } from "../generated";
import { useProposalState } from "../model/Proposal";
import { NounPartType } from "../types/noun";
import { generateProposalContent } from "../utils/propose/generateProposalContent";
import { useIsNouner } from "../utils/propose/useIsNouner";
import { useProposalImages } from "../utils/propose/useProposalImages";
import { useProposePart } from "../utils/propose/useProposePart";
import { OnchainActionButton } from "./OnchainActionButton";
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
    provenanceUrl,
    setprovenanceUrl,
    setWordsFromArtist,
    wordsFromArtist,
  } = useProposalState();

  const { isOpen: agreedToCc0, onToggle: toggleCc0Agreement } = useDisclosure();

  const { isConnected, address: artistAddress } = useAccount();

  const isNameValid = partName.length > 0;
  const areWordsFromArtistValid = wordsFromArtist.length > 0;
  const { data: createCandidateCost } = useNounsDataCreateCandidateCost();
  const isNouner = useIsNouner(artistAddress);

  const { isUploading, ...proposalImages } = useProposalImages(
    partType,
    partBitmap
  );
  const canSubmit =
    isNameValid && areWordsFromArtistValid && !isUploading && agreedToCc0;
  const [description, setDescription] = useState("Loading...");

  useEffect(() => {
    generateProposalContent(
      partType,
      partName,
      proposalImages,
      wordsFromArtist,
      provenanceUrl
    ).then(setDescription);
  }, [partBitmap, partName, provenanceUrl, wordsFromArtist, proposalImages]);

  const { data, writeAsync: proposePart } = useProposePart({
    description,
    partType,
    partName,
    artistAddress,
    droposalMediaUri: proposalImages.editionImage,
    partBitmap,
  });

  const {
    isLoading: isSubmitting,
    isSuccess,
    isError,
  } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <VStack
      align={"start"}
      bgColor="gray.900"
      color="gray.100"
      h="full"
      w="full"
      overflowY={"hidden"}
      p={10}
      spacing={10}
    >
      <Button onClick={() => setPartBitmap(null)}>← Back</Button>

      <SimpleGrid
        templateColumns={"auto minmax(360px, 675px)"}
        columnGap={10}
        h="full"
        mb={2}
        overflow={"hidden"}
      >
        <VStack spacing={4} justifyContent={"start"} overflowY={"scroll"}>
          <FormControl textAlign={"left"} isRequired isInvalid={!isNameValid}>
            <FormLabel>Name your {partType}</FormLabel>
            <Input
              value={partName}
              placeholder="Foo"
              maxW={"md"}
              textAlign={"left"}
              onChange={(e) => setPartName(e.target.value)}
            />
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
            <FormHelperText textAlign={"left"}>
              Include a link that shows the first public appearance of your
              artwork
            </FormHelperText>
          </FormControl>
          <FormControl isRequired isInvalid={!areWordsFromArtistValid}>
            <FormLabel>Words from the artist</FormLabel>
            <Textarea
              rows={10}
              placeholder="Something, something, ⌐◨‒◨"
              resize={"none"}
              value={wordsFromArtist}
              textAlign={"left"}
              onChange={(e) => setWordsFromArtist(e.target.value)}
            />
            <FormHelperText textAlign={"left"}>
              Say a few words about your art. Markdown accepted
            </FormHelperText>
          </FormControl>
          <FormControl isRequired isInvalid={!agreedToCc0}>
            <FormLabel>CC-0 acknowledgement</FormLabel>
            <Checkbox
              size={"lg"}
              spacing={6}
              isChecked={agreedToCc0}
              onChange={toggleCc0Agreement}
            >
              <Text textAlign={"left"} fontSize={"xs"}>
                I acknowledge that I am releasing my artwork under the{" "}
                <Link
                  textDecoration={"underline"}
                  color={"blue.400"}
                  href="https://creativecommons.org/publicdomain/zero/1.0/"
                >
                  Creative Commons Zero
                </Link>{" "}
                license if the proposal is executed.
              </Text>
            </Checkbox>
            <FormHelperText textAlign={"left"}></FormHelperText>
          </FormControl>
          <OnchainActionButton
            disconnectedText="Connect to submit"
            wrongNetworkText="Switch network to submit"
            isLoading={isSubmitting}
            loadingText="Submitting"
            onClick={() => proposePart?.()}
            w={"full"}
            p={6}
            h={"fit-content"}
            maxH={"full"}
            colorScheme="pink"
            size={"lg"}
            isDisabled={!proposePart || !canSubmit}
          >
            Submit proposal candidate
          </OnchainActionButton>
          {!!createCandidateCost && isConnected && isNouner === false && (
            <Text fontSize={12}>{`Since you're not a Nouner, a ${formatEther(
              createCandidateCost
            )} ETH fee will be included`}</Text>
          )}
        </VStack>
        <VStack align={"start"} h="full" overflow={"hidden"}>
          <HStack w={"full"} justifyContent={"space-between"}>
            <Text fontSize={16}>Proposal Preview:</Text>
            {isUploading && (
              <Text fontSize={10}>
                <Spinner size={"xs"} />
                {"  Uploading images"}
              </Text>
            )}
          </HStack>
          <ProposalPreview description={description} overflowY={"scroll"} />
        </VStack>
      </SimpleGrid>
    </VStack>
  );
};
