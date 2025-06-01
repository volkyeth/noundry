"use client";

import { uploadUpdatePropImages } from "@/app/actions/uploadUpdatePropImages";
import { BraveDisclaimer } from "@/components/BraveDisclaimer";
import { Button } from "@/components/Button";
import { ChecklistItem } from "@/components/ChecklistItem";
import { ConnectButton } from "@/components/ConnectButton";
import Dynamic from "@/components/Dynamic";
import { LikeWidget } from "@/components/LikeWidget";
import { Noun } from "@/components/Noun";
import { ProposalPreview } from "@/components/ProposalPreview";
import { SubmissionCard } from "@/components/SubmissionCard";
import { TraitOnCheckerboard } from "@/components/TraitOnCheckerboard";
import { TraitPalette } from "@/components/TraitPalette";
import { TraitPicker } from "@/components/TraitPicker";
import { UserBadge } from "@/components/UserBadge";
import { AMOUNT_PROPOSAL_PREVIEWS } from "@/constants/config";
import { useImageBitmap } from "@/hooks/useImageBitmap";
import { useIsNouner } from "@/hooks/useIsNouner";
import { useMainnetArtwork } from "@/hooks/useMainnetArtwork";
import { usePaletteIndex } from "@/hooks/usePaletteIndex";
import { useTraitBitmap } from "@/hooks/useTraitBitmap";
import { useTraitColors } from "@/hooks/useTraitColors";
import { useUserInfo } from "@/hooks/useUserInfo";
import { NounTraits } from "@/types/noun";
import { Trait } from "@/types/trait";
import { UserInfo } from "@/types/user";
import { traitType } from "@/utils/misc/traitType";
import { generateSeed } from "@/utils/nouns/generateSeed";
import { getTraitsFromSeed } from "@/utils/nouns/getTraitsFromSeed";
import { titleCase } from "@/utils/titleCase";
import { formatSubmissionType } from "@/utils/traits/format";
import { appConfig } from "@/variants/config";
import {
  generateUpdateProposalContent,
  UpdateProposalImagesUris,
} from "@/variants/nouns/components/propose-update/generateUpdateProposalContent";
import { useCreateCandidateCost } from "@/variants/nouns/components/propose/useCreateCandidateCost";
import { Divider, Input, Link, Textarea } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import NextLink from "next/link";
import { NounSeed, TRANSPARENT_HEX } from "noggles";
import { nounsTraitNames } from "noggles/src/nouns/traitNames";
import InfoBox from "pixelarticons/svg/info-box.svg";
import { useMemo, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { formatEther } from "viem";
import { mainnet } from "viem/chains";
import {
  useAccount,
  useBalance,
  useSignMessage,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useProposeTraitUpdateSimulation } from "./useProposeTraitUpdate";
const { LoadingNoggles } = appConfig;

export interface ProposeUpdateProps {
  trait: Trait;
  author: UserInfo;
}

export const ProposeUpdate = ({ trait, author }: ProposeUpdateProps) => {
  const [salt] = useState(Math.random());
  const { address } = useAccount();
  const { data: mainnetArtwork } = useMainnetArtwork();

  const [selectedTraitIndex, setSelectedTraitIndex] = useState<number | null>(
    null,
  );
  const [customTitle, setCustomTitle] = useState("");

  const originalTraitName =
    trait.type &&
    selectedTraitIndex !== null &&
    titleCase(nounsTraitNames[trait.type]?.[selectedTraitIndex]);

  const encodedOriginalTrait = useMemo(() => {
    if (selectedTraitIndex === null || !mainnetArtwork) return null;

    const category = trait.type;

    return category &&
      mainnetArtwork &&
      mainnetArtwork[category] &&
      mainnetArtwork[category][selectedTraitIndex]
      ? mainnetArtwork[category][selectedTraitIndex]
      : null;
  }, [selectedTraitIndex, mainnetArtwork, trait]);

  const originalTraitBitmap = useTraitBitmap(encodedOriginalTrait);
  const traitBitmap = useTraitBitmap(trait.trait);

  const originalTraitColors = useTraitColors(encodedOriginalTrait);
  const originalTraitColorsWithoutTransparent = useMemo(
    () =>
      originalTraitColors?.filter((color) => color !== TRANSPARENT_HEX) || [],
    [originalTraitColors],
  );

  const traitColors = useTraitColors(trait.trait);
  const traitColorsWithoutTransparent = useMemo(
    () => traitColors?.filter((color) => color !== TRANSPARENT_HEX) || [],
    [traitColors],
  );

  // Calculate palette index using useMemo, since usePaletteIndex is a regular function
  const paletteIndex =
    usePaletteIndex(traitColors, mainnetArtwork?.palettes) ?? undefined;

  const [oldStandaloneCanvas, setOldStandaloneCanvas] =
    useState<HTMLCanvasElement | null>(null);

  const [oldPaletteCanvas, setOldPaletteCanvas] =
    useState<HTMLCanvasElement | null>(null);

  const [newStandaloneCanvas, setNewStandaloneCanvas] =
    useState<HTMLCanvasElement | null>(null);
  const [newPaletteCanvas, setNewPaletteCanvas] =
    useState<HTMLCanvasElement | null>(null);

  const [galleryCanvases, setGalleryCanvases] = useState<
    Map<number, HTMLCanvasElement>
  >(new Map());

  const setGalleryCanvas = (index: number, canvas: HTMLCanvasElement | null) =>
    setGalleryCanvases((draft) => {
      canvas ? draft.set(index, canvas) : draft.delete(index);

      return draft;
    });

  const { data: userInfo } = useUserInfo(address);

  const artContributionAgreementMessage = `I, ${
    userInfo?.nameOrPseudonym ?? userInfo?.userName
  }, hereby waive all copyright and related or neighboring rights together with all associated claims and causes of action with respect to this work to the extent possible under the law.
I have read and understand the terms and intended legal effect of the Nouns Art Contribution Agreement, available at https://ern3fbtsj23a2achuj5kqa4xtp2yvplqjy2r6cemo6ep52lfn2cq.arweave.net/JFuyhnJOtg0AR6J6qAOXm_WKvXBONR8IjHeI_ullboU, and hereby voluntarily elect to apply it to this contribution.

Contribution name: ${trait.name} ${formatSubmissionType(trait.type)}
Contribution specification: ${trait.trait}`;

  const {
    data: artContributionAgreementSignature,
    signMessage: signArtContributionAgreement,
  } = useSignMessage();

  const previewNounBitmap = useImageBitmap(trait.nft);

  const { chainId } = useAccount();
  const isMainnet = chainId === mainnet.id;
  const { switchChain } = useSwitchChain();

  // Always create previewNounsTraits with the same hook call, returning undefined or an empty array if dependencies aren't ready
  const previewNounsTraits = useMemo(() => {
    if (!mainnetArtwork) return undefined;
    if (!originalTraitBitmap || typeof originalTraitBitmap !== "object")
      return [];
    if (selectedTraitIndex === null) return [];

    return new Array(AMOUNT_PROPOSAL_PREVIEWS)
      .fill(undefined)
      .flatMap((_, i) => {
        const seed: NounSeed = {
          ...generateSeed(mainnetArtwork, salt + i),
          body: i % mainnetArtwork.bodies.length,
          glasses: i % mainnetArtwork.glasses.length,
          background: i % mainnetArtwork.backgrounds.length,
        };
        if (i < mainnetArtwork.bodies.length) seed.accessory = 70; //use "none" accessory on the first appearance of each body color

        const baseTraits = getTraitsFromSeed(seed, mainnetArtwork);

        // Create a pair of Nouns with the same traits except the one being updated
        return [
          {
            // Old trait version
            ...baseTraits,
            [traitType(trait)]: originalTraitBitmap,
          },
          {
            // New trait version
            ...baseTraits,
            [traitType(trait)]: trait.trait,
          },
        ];
      });
  }, [salt, trait, mainnetArtwork, originalTraitBitmap, selectedTraitIndex]);

  const isCreator =
    address && trait.address.toLowerCase() === address.toLowerCase();

  const isNouner = useIsNouner(address);
  const { data: balance } = useBalance({ address });
  const createCandidateCost = useCreateCandidateCost();
  const [wordsFromArtist, setWordsFromArtist] = useState("");
  const setWordsFromAuthor = useDebounceCallback(setWordsFromArtist, 1000);
  const setDebouncedCustomTitle = useDebounceCallback(setCustomTitle, 1000);

  const canSubmitProposalCandidate =
    isNouner || createCandidateCost
      ? balance
        ? balance.value >= createCandidateCost!
        : undefined
      : undefined;

  const prerequisitesMet =
    isCreator &&
    paletteIndex !== undefined &&
    canSubmitProposalCandidate &&
    selectedTraitIndex !== null &&
    selectedTraitIndex !== null;

  // Fix the previewImagesReady check to match our new canvas structure
  const previewImagesReady =
    mainnetArtwork &&
    newStandaloneCanvas &&
    oldStandaloneCanvas &&
    oldPaletteCanvas &&
    newPaletteCanvas;

  const {
    isPending: isUploading,
    mutate: uploadImages,
    isSuccess: imagesUploaded,
    data: uploadedImages,
  } = useMutation({
    mutationFn: async () => {
      if (!previewImagesReady) throw new Error("Preview images not ready");

      const propImages: UpdateProposalImagesUris = {
        oldStandalone: oldStandaloneCanvas.toDataURL("image/png"),
        newStandalone: newStandaloneCanvas.toDataURL("image/png"),
        oldPalette: oldPaletteCanvas.toDataURL("image/png"),
        newPalette: newPaletteCanvas.toDataURL("image/png"),
        galleryImages: Array.from(galleryCanvases.values()).map((canvas) =>
          canvas.toDataURL("image/png"),
        ),
      };

      return await uploadUpdatePropImages(propImages);
    },
  });

  const proposalContent = useMemo(() => {
    if (
      !previewImagesReady ||
      selectedTraitIndex === null ||
      !originalTraitName ||
      !newStandaloneCanvas ||
      !oldStandaloneCanvas ||
      !oldPaletteCanvas ||
      !newPaletteCanvas ||
      !originalTraitBitmap
    )
      return undefined;

    const proposalImages =
      uploadedImages ||
      ({
        oldStandalone: oldStandaloneCanvas.toDataURL(),
        newStandalone: newStandaloneCanvas.toDataURL(),
        oldPalette: oldPaletteCanvas.toDataURL(),
        newPalette: newPaletteCanvas.toDataURL(),
        galleryImages: Array.from(galleryCanvases.values()).map((canvas) =>
          canvas.toDataURL(),
        ),
      } as any);

    return generateUpdateProposalContent({
      trait,
      proposalImages,
      wordsFromArtist,
      amountOldPaletteColors:
        originalTraitColorsWithoutTransparent?.length ?? 0,
      amountNewPaletteColors: traitColorsWithoutTransparent?.length ?? 0,
      originalTraitName,
      originalTraitIndex: selectedTraitIndex,
      artContributionAgreementMessage,
      artContributionAgreementSignature,
      artContributionAgreementSigner: address,
      customTitle,
    });
  }, [
    previewImagesReady,
    selectedTraitIndex,
    originalTraitName,
    wordsFromArtist,
    newStandaloneCanvas,
    oldStandaloneCanvas,
    oldPaletteCanvas,
    newPaletteCanvas,
    originalTraitBitmap,
    originalTraitColorsWithoutTransparent?.length,
    traitColorsWithoutTransparent?.length,
    uploadedImages,
    galleryCanvases,
    trait,
    artContributionAgreementMessage,
    artContributionAgreementSignature,
    address,
    customTitle,
  ]);

  const { data: simulation, isFetching: isSimulating } =
    useProposeTraitUpdateSimulation({
      createCandidateCost,
      isNouner,
      description: proposalContent,
      trait,
      paletteIndex,
      traitToUpdateIndex: selectedTraitIndex ?? 0,
    });

  const {
    writeContractAsync: propose,
    data: proposeTx,
    isPending: isProposing,
  } = useWriteContract();

  const { isSuccess: proposalSuccessful, isError: proposalFailed } =
    useWaitForTransactionReceipt({ hash: proposeTx });

  // Create a transparent traits object for the trait picker
  const transparentTraits = useMemo((): NounTraits => {
    // Set all traits to transparent
    return {
      background: "#00000000",
      body: "0x00",
      accessory: "0x00",
      head: "0x00",
      glasses: "0x00",
    };
  }, []);

  return (
    <>
      <BraveDisclaimer />
      <div className="max-w-3xl mx-auto py-8 px-4 lg:p-10">
        <div className="flex flex-col items-center justify-center gap-10 lg:gap-16">
          <h1>Propose Update</h1>
          <div className="flex flex-col gap-2 w-min">
            <SubmissionCard
              name={trait.name}
              type={trait.type}
              image={
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt="Trait preview"
                  src={trait.trait}
                  className="w-full h-full"
                />
              }
              previewImage={
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt="Trait preview"
                  src={trait.nft}
                  className="w-full h-full"
                />
              }
              footer={
                <>
                  <div className="flex flex-col gap-2 text-medium">
                    <p className="text-sm  text-default-500">
                      {formatDistanceToNow(trait.creationDate, {
                        addSuffix: true,
                      })}{" "}
                      by
                    </p>
                    <Link
                      href={`/profile/${author.address}`}
                      as={NextLink}
                      color="foreground"
                      className="text-sm text-default-500"
                    >
                      <UserBadge address={author.address} />
                    </Link>
                  </div>
                  <LikeWidget
                    liked={false}
                    likesCount={trait.likesCount}
                    traitId={trait.id}
                  />
                </>
              }
            />
          </div>
          <p>
            You&apos;re about to propose updating an existing trait in the Nouns
            DAO with the above trait.
          </p>
          <p>
            This process will create a Nouns{" "}
            <Link
              href="https://nouns.wtf/create-candidate"
              underline="always"
              color="foreground"
            >
              Proposal Candidate
            </Link>{" "}
            using a standard template to showcase your trait alongside the
            existing trait you want to update.
          </p>

          <p className="border-2 p-6 gap-4">
            ℹ️ If you wish to include additional transactions (such as a
            Droposal, transfer of funds, etc.), you can add them to the Proposal
            Candidate after its initial publication. We strongly advise against
            modifying the template or the initial transaction that updates the
            encoded trait in the Descriptor, as doing so could result in
            proposing gibberish pixels to the DAO.
          </p>

          <p className="border-2 p-6 gap-4">
            ⚠️ This update proposal should not be published while there are any
            props adding or updating {traitType(trait)} traits up because it
            could cause conflicts. Furthermore, this proposal will also become
            invalid if another {traitType(trait)} trait is added to the DAO
            between the time this one was submitted as a candidate and the time
            of it graduating to a proposal, so time is of the essence! Get your
            sponsors ready before submitting!
          </p>

          <h2 id="prerequisites">Prerequisites</h2>
          <div className="bg-content1 max-w-2xl flex flex-col p-10 gap-4 px-7 w-full shadow-md">
            <p>First, let&apos;s make sure everything is good to go</p>

            <Dynamic>
              <ul className="space-y-4">
                <li>
                  <InfoBox className="align-bottom inline h-7 w-7 text-blue-500" />{" "}
                  Make sure the trait adheres to the{" "}
                  <Link
                    href={"/guidelines"}
                    as={NextLink}
                    target="_blank"
                    className="text-blue-500"
                    color="foreground"
                    underline="always"
                  >
                    guidelines
                  </Link>
                  !
                </li>
                <ChecklistItem
                  isTicked={isCreator}
                  warningContent={
                    "Oops! You must be the creator to propose it to the DAO"
                  }
                >
                  You are the creator of the trait.
                </ChecklistItem>
                <ChecklistItem
                  isTicked={paletteIndex !== undefined}
                  warningContent={
                    <>
                      Oh, it uses some colors that do not belong to the Nouns
                      palette. Try fixing that on{" "}
                      <Link
                        target="_blank"
                        href="https://studio.noundry.wtf/palette"
                        color="danger"
                        className="underline text-sm"
                      >
                        Noundry Studio
                      </Link>{" "}
                      or your favorite editor and resubmitting.
                      <br />
                      <span className="text-xs">
                        (If this is unexpected, and you submitted the trait via
                        Brave browser, the browser anti-fingerprinting feature
                        might have messed with your artwork. Reach out with the
                        original artwork and we&apos;ll sort it out)
                      </span>
                    </>
                  }
                >
                  The trait conforms to the Nouns palette
                </ChecklistItem>
                <ChecklistItem
                  isTicked={canSubmitProposalCandidate}
                  warningContent={
                    <>
                      Oh, looks like you don&apos;t have enough funds to pay for
                      creating a proposal candidate.
                    </>
                  }
                >
                  You&apos;re either a Nouner or you have the required{" "}
                  {createCandidateCost ? (
                    formatEther(createCandidateCost)
                  ) : (
                    <LoadingNoggles className="w-12" />
                  )}{" "}
                  ETH to create a Proposal Candidate
                </ChecklistItem>
                <ChecklistItem
                  isTicked={selectedTraitIndex !== null ? true : undefined}
                  warningContent={null}
                >
                  You&apos;ve selected a trait to update
                </ChecklistItem>
                {originalTraitBitmap && selectedTraitIndex !== null && (
                  <>
                    <TraitOnCheckerboard
                      size={128}
                      trait={originalTraitBitmap}
                    />
                    <p>
                      {originalTraitName} {formatSubmissionType(trait.type)}
                    </p>
                  </>
                )}
                <TraitPicker
                  traitType={traitType(trait)}
                  currentTraits={transparentTraits}
                  onPick={(index) => {
                    // Just update the index, and handle everything else in an effect
                    setSelectedTraitIndex(index);
                  }}
                  className="w-full mt-2"
                  classNames={{
                    button: "w-fit",
                  }}
                >
                  {selectedTraitIndex === null
                    ? "Select trait"
                    : "Change selection"}
                </TraitPicker>
                <Divider className="!my-12" />
                <ChecklistItem
                  isUserTickable
                  id="agreement"
                  isTicked={artContributionAgreementSignature !== undefined}
                  onTick={() =>
                    signArtContributionAgreement({
                      message: artContributionAgreementMessage,
                    })
                  }
                  tickableContent={
                    <div className="flex flex-col gap-4">
                      <p className="text-sm text-foreground">
                        You&apos;ll be prompted to sign the following statement
                        releasing your artwork under the{" "}
                        <strong>CC0 license</strong> and agreeing to the Nouns
                        Art Contribution Agreement, which will then be included
                        in the proposal:
                      </p>
                      <Dynamic>
                        <pre className="text-xs p-2 border text-foreground/75 break-words whitespace-pre-wrap">
                          {artContributionAgreementMessage}
                        </pre>
                      </Dynamic>
                      <Button
                        className="w-full"
                        onClick={() =>
                          signArtContributionAgreement({
                            message: artContributionAgreementMessage,
                          })
                        }
                      >
                        Sign Nouns Art Contribution Agreement
                      </Button>
                    </div>
                  }
                >
                  You&apos;ve signed the{" "}
                  <Link
                    href={
                      "https://ern3fbtsj23a2achuj5kqa4xtp2yvplqjy2r6cemo6ep52lfn2cq.arweave.net/JFuyhnJOtg0AR6J6qAOXm_WKvXBONR8IjHeI_ullboU"
                    }
                    className="text-blue-500"
                    color="foreground"
                    target="_blank"
                    underline="always"
                  >
                    Nouns Art Contribution Agreement
                  </Link>
                </ChecklistItem>
              </ul>
              {!address && <ConnectButton />}
            </Dynamic>
          </div>

          {previewNounsTraits &&
            traitBitmap &&
            traitColorsWithoutTransparent &&
            mainnetArtwork &&
            originalTraitBitmap &&
            originalTraitColorsWithoutTransparent && (
              <div className="hidden">
                <TraitOnCheckerboard
                  ref={setNewStandaloneCanvas}
                  size={256}
                  trait={traitBitmap}
                />
                <TraitOnCheckerboard
                  ref={setOldStandaloneCanvas}
                  size={256}
                  trait={originalTraitBitmap}
                />

                <TraitPalette
                  ref={setOldPaletteCanvas}
                  colors={originalTraitColorsWithoutTransparent}
                  className="w-fit h-fit"
                />
                <TraitPalette
                  ref={setNewPaletteCanvas}
                  colors={traitColorsWithoutTransparent}
                  className="w-fit h-fit"
                />

                {/* Gallery of side-by-side comparisons */}
                {previewNounsTraits &&
                  previewNounsTraits.map((traits, i) => (
                    <Noun
                      key={i}
                      canvasRef={(canvas) => setGalleryCanvas(i, canvas)}
                      margin={2}
                      {...traits}
                      withCheckerboardBg={false}
                      size={96}
                    />
                  ))}
              </div>
            )}

          <h2 className="self-center">Your space</h2>
          <div className="bg-content1 max-w-2xl flex flex-col p-10 gap-4 px-7 w-full shadow-md">
            <Input
              label="Title"
              placeholder={`Update ${
                originalTraitName || "the"
              } ${formatSubmissionType(trait.type)}`}
              labelPlacement="outside"
              className="flex-grow"
              onChange={(e) => setDebouncedCustomTitle(e.target.value)}
            />
            <p>
              This is your space to talk about your trait and whatever else
              you&apos;d like. Tell the DAO why they should update the existing
              trait with your new version!
            </p>

            <p>
              Markdown is accepted. Avoid links and images that might be
              unavailable in the future.
            </p>

            <p>(You can preview the rendered Markdown below)</p>

            <Textarea
              label="Words from the author"
              defaultValue={wordsFromArtist}
              labelPlacement="outside"
              minRows={20}
              onChange={(e) => setWordsFromAuthor(e.target.value)}
              placeholder="Say your piece here..."
              classNames={{ mainWrapper: "mt-8" }}
            />
          </div>

          <h2>Preview</h2>
          {proposalContent ? (
            <ProposalPreview
              description={proposalContent}
              className="w-full max-w-2xl rounded-none"
            />
          ) : (
            <div className="bg-content1 max-w-2xl flex flex-col p-10 gap-4 px-7 w-full shadow-md">
              <p>
                <LoadingNoggles className="inline w-12" /> Generating previews
              </p>
            </div>
          )}

          {prerequisitesMet && artContributionAgreementSignature && (
            <p>
              If everything seems about right, let&apos;s get ready to submit!
            </p>
          )}
          {!prerequisitesMet && (
            <p>
              You don&apos;t meet the{" "}
              <Link
                underline="always"
                href="#prerequisites"
                className="text-red-500"
              >
                prerequisites.
              </Link>
            </p>
          )}
          {prerequisitesMet && !artContributionAgreementSignature && (
            <p>
              You must sign the{" "}
              <Link
                underline="always"
                href="#agreement"
                className="text-red-500"
              >
                Art Contribution Agreement
              </Link>{" "}
              to proceed.
            </p>
          )}

          <Button
            onClick={() => {
              uploadImages();
            }}
            isLoading={isUploading}
            disabled={
              !prerequisitesMet ||
              !artContributionAgreementSignature ||
              !previewImagesReady ||
              imagesUploaded
            }
            loadingContent="Uploading images..."
          >
            {imagesUploaded ? "Images uploaded" : "Upload images"}
          </Button>

          {imagesUploaded && (
            <>
              <p>Ready to submit? Let&apos;s do it!</p>
              <Button
                loadingContent={isSimulating ? "Simulating tx" : "Submitting"}
                isLoading={isProposing || isSimulating}
                disabled={
                  isProposing ||
                  !propose ||
                  !!proposeTx ||
                  !Boolean(simulation?.request)
                }
                onClick={() =>
                  isMainnet
                    ? propose(simulation!.request)
                    : switchChain({ chainId: mainnet.id })
                }
              >
                {isMainnet ? "Submit" : "Switch to Mainnet"}
              </Button>
            </>
          )}

          {proposeTx && (
            <p>
              Transaction submitted.{" "}
              <Link href={`https://etherscan.io/tx/${proposeTx}`}>
                See it on Etherscan
              </Link>
            </p>
          )}

          {proposalSuccessful && (
            <p>
              Proposal candidate submitted! Check{" "}
              <Link href="https://nouns.wtf/vote#candidates">nouns.wtf</Link> or{" "}
              <Link href="https://www.nouns.camp/?tab=candidates">
                nouns.camp
              </Link>{" "}
              to see it live.
            </p>
          )}

          {proposalFailed && (
            <p>
              Oh no, something went wrong! Please reach out with your etherscan
              link and we&apos;ll figure it out together.
            </p>
          )}
        </div>
      </div>
    </>
  );
};
