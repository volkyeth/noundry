"use client";

import {
  ProposalImagesUris,
  generateProposalContent,
} from "@/app/propose/generateProposalContent";
import LoadingNoggles from "@/assets/loading-noggles.svg";
import { BraveDisclaimer } from "@/components/BraveDisclaimer";
import { Button } from "@/components/Button";
import { ConnectButton } from "@/components/ConnectButton";
import Dynamic from "@/components/Dynamic";
import { LikeWidget } from "@/components/LikeWidget";
import { ProposalPreview } from "@/components/ProposalPreview";
import { TraitCard } from "@/components/TraitCard";
import { UserBadge } from "@/components/UserBadge";
import { AMOUNT_PROPOSAL_PREVIEWS } from "@/constants/config";
import { useCreateCandidateCost } from "@/hooks/useCreateCandidateCost";
import { useImageBitmap } from "@/hooks/useImageBitmap";
import { useIsNouner } from "@/hooks/useIsNouner";
import { useMainnetArtwork } from "@/hooks/useMainnetArtwork";
import { usePaletteIndex } from "@/hooks/usePaletteIndex";
import { useResizedImage } from "@/hooks/useResizedCanvas";
import { useTraitBitmap } from "@/hooks/useTraitBitmap";
import { useTraitColors } from "@/hooks/useTraitColors";
import { useUserInfo } from "@/hooks/useUserInfo";
import { Trait } from "@/types/trait";
import { UserInfo } from "@/types/user";
import { traitType } from "@/utils/misc/traitType";
import { generateSeed } from "@/utils/nouns/generateSeed";
import { getTraitsFromSeed } from "@/utils/nouns/getTraitsFromSeed";
import { formatTraitType } from "@/utils/traits/format";
import { Divider, Link, Textarea } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import NextLink from "next/link";
import { NounSeed, NounTraits, TRANSPARENT_HEX } from "noggles";
import InfoBox from "pixelarticons/svg/info-box.svg";
import { useMemo, useState } from "react";
import { useDebounceCallback, useLocalStorage } from "usehooks-ts";
import { formatEther } from "viem";
import {
  useAccount,
  useBalance,
  useSignMessage,
  useWaitForTransaction,
} from "wagmi";
import { ChecklistItem } from "./ChecklistItem";
import { TraitOnCheckerboard } from "./TraitOnCheckerboard";
import { TraitPalette } from "./TraitPalette";
import { useProposeTrait } from "./useProposeTrait";

export interface ProposeProps {
  trait: Trait;
  author: UserInfo;
}

export const Propose = ({ trait, author }) => {
  const [salt] = useState(Math.random());
  const { address } = useAccount();

  const { data: mainnetArtwork } = useMainnetArtwork();
  const traitBitmap = useTraitBitmap(trait.trait) ?? null;
  const [circleCropLgCanvas, setCircleCropLgCanvas] =
    useState<HTMLCanvasElement | null>(null);
  const [standaloneCanvas, setStandaloneCanvas] =
    useState<HTMLCanvasElement | null>(null);
  const [paletteCanvas, setPaletteCanvas] = useState<HTMLCanvasElement | null>(
    null
  );
  const [previewNounCanvas, setPreviewNounCanvas] =
    useState<HTMLCanvasElement | null>(null);

  const { data: userInfo } = useUserInfo(address);

  const artContributionAgreementMessage = `I, ${
    userInfo?.nameOrPseudonym ?? userInfo?.userName
  }, hereby waive all copyright and related or neighboring rights together with all associated claims and causes of action with respect to this work to the extent possible under the law.
I have read and understand the terms and intended legal effect of the Nouns Art Contribution Agreement, available at https://z5pvlzj323gcssdd3bua3hjqckxbcsydr4ksukoidh3l46fhet4q.arweave.net/z19V5TvWzClIY9hoDZ0wEq4RSwOPFSopyBn2vninJPk, and hereby voluntarily elect to apply it to this contribution.

Contribution name: ${trait.name} ${formatTraitType(trait.type)}
Contribution specification: ${trait.trait}`;

  const {
    data: artContributionAgreementSignature,
    signMessage: signArtContributionAgreement,
  } = useSignMessage({
    message: artContributionAgreementMessage,
  });

  const previewNounBitmap = useImageBitmap(trait.nft);

  const previewNounsTraits = useMemo(
    () =>
      mainnetArtwork
        ? new Array(AMOUNT_PROPOSAL_PREVIEWS).fill(undefined).map((_, i) => {
            const seed: NounSeed = {
              ...generateSeed(mainnetArtwork, salt + i),
              body: i % mainnetArtwork.bodies.length,
              glasses: i % mainnetArtwork.glasses.length,
              background: i % mainnetArtwork.backgrounds.length,
            };
            if (i < mainnetArtwork.bodies.length) seed.accessory = 70; //use "none" accessory on the first appearance of each body color
            return {
              ...getTraitsFromSeed(seed, mainnetArtwork),
              [traitType(trait)]: trait.trait,
            };
          })
        : undefined,
    [salt, trait, mainnetArtwork]
  );

  useResizedImage({
    input: previewNounBitmap,
    canvas: previewNounCanvas,
    size: 128,
  });
  useResizedImage({
    input: previewNounBitmap,
    canvas: circleCropLgCanvas,
    size: 128,
    circleCrop: true,
  });

  // const [galleryCanvases, setGalleryCanvases] = useState<
  //   Map<number, HTMLCanvasElement>
  // >(new Map());
  // const setGalleryCanvas = (index: number, canvas: HTMLCanvasElement | null) =>
  //   setGalleryCanvases((draft) => {
  //     canvas ? draft.set(index, canvas) : draft.delete(index);

  //     return draft;
  //   });
  const isCreator =
    address && trait.address.toLowerCase() === address.toLowerCase();

  const isNouner = useIsNouner(address);
  const { data: balance } = useBalance({ address });
  const createCandidateCost = useCreateCandidateCost();
  const [wordsFromAuthor, innerSetWordsFromAuthor] = useLocalStorage(
    `words-${trait.id}`,
    ""
  );
  const setWordsFromAuthor = useDebounceCallback(innerSetWordsFromAuthor, 1000);

  const canSubmitProposalCandidate =
    isNouner || createCandidateCost
      ? balance
        ? balance.value >= createCandidateCost!
        : undefined
      : undefined;

  const traitColors = useTraitColors(trait.trait);
  const traitColorsWithoutTransparent = useMemo(
    () => traitColors?.filter((color) => color !== TRANSPARENT_HEX),
    [traitColors]
  );

  const paletteIndex =
    usePaletteIndex(traitColors, mainnetArtwork?.palettes) ?? undefined;

  const prerequisitesMet =
    isCreator && paletteIndex !== null && canSubmitProposalCandidate;

  const previewImagesReady =
    mainnetArtwork &&
    circleCropLgCanvas &&
    standaloneCanvas &&
    previewNounCanvas &&
    paletteCanvas

  const previewTraits: NounTraits | undefined = useMemo(() => {
    if (!mainnetArtwork || !traitBitmap) return undefined;
    return {
      ...getTraitsFromSeed(
        {
          accessory: 70, //empty
          background: 0, //cool
          body: 13, //black
          glasses: 4, //blue noggles
          head: 216, //void head
        },
        mainnetArtwork
      ),
      [traitType(trait)]: traitBitmap,
    };
  }, [trait, traitBitmap, mainnetArtwork]);

  const {
    isLoading: isUploading,
    mutate: uploadImages,
    isSuccess: imagesUploaded,
    data: uploadedImages,
  } = useMutation({
    mutationFn: async () => {
      if (!previewImagesReady) throw new Error("Preview images not ready");

      const propImages: ProposalImagesUris = {
        circleCropLg: circleCropLgCanvas.toDataURL("image/png"),
        standalone: standaloneCanvas.toDataURL("image/png"),
        palette: paletteCanvas.toDataURL("image/png"),
        previewNoun: previewNounCanvas.toDataURL("image/png"),
      };

      return propImages;
    },
  });

  const proposalContent = useMemo(() => {
    if (!previewImagesReady) return undefined;

    return generateProposalContent({
      trait,
      wordsFromArtist: wordsFromAuthor,
      proposalImages: uploadedImages ?? {
        previewNoun: previewNounCanvas.toDataURL("image/png"),
        circleCropLg: circleCropLgCanvas.toDataURL("image/png"),
        standalone: standaloneCanvas.toDataURL("image/png"),
        palette: paletteCanvas.toDataURL("image/png"),
      },
      amountPaletteColors: traitColorsWithoutTransparent?.length ?? 0,
      artContributionAgreementMessage,
      artContributionAgreementSignature,
      artContributionAgreementSigner: address,
    });
  }, [
    previewImagesReady,
    trait,
    wordsFromAuthor,
    uploadedImages,
    previewNounCanvas,
    circleCropLgCanvas,
    standaloneCanvas,
    paletteCanvas,
    traitColorsWithoutTransparent?.length,
    artContributionAgreementMessage,
    artContributionAgreementSignature,
    address,
  ]);

  const {
    writeAsync: propose,
    isLoading: isProposing,
    data: proposeTx,
  } = useProposeTrait({
    createCandidateCost,
    isNouner,
    description: proposalContent,
    trait,
    paletteIndex,
  });

  const { isSuccess: proposalSuccessful, isError: proposalFailed } =
    useWaitForTransaction(proposeTx);

  return (
    <>
      <BraveDisclaimer />
      <div className="max-w-3xl mx-auto py-8 px-4 lg:p-10">
        <div className="flex flex-col items-center justify-center gap-10 lg:gap-16">
          <h1>Propose</h1>
          <div className="flex flex-col gap-2 w-min">
            <TraitCard
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
                    liked={trait.liked}
                    likesCount={trait.likesCount}
                    traitId={trait.id}
                  />
                </>
              }
            />
          </div>
          <p>
            You&apos;re about to propose the above trait to the Nouns DAO, so it
            can become part of the original onchain Nouns. Pretty exciting, huh!
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
            existing Nouns traits.
          </p>
          <p>
            It will help Nouners ensure that your trait integrates seamlessly
            with the original collection. The proposal candidate will also
            include a transaction that adds your trait to the Nouns Descriptor,
            officially making it part of the onchain collection.
          </p>

          <p className="border-2 p-6 gap-4">
            ℹ️ If you wish to include additional transactions (such as a
            Droposal, transfer of funds, etc.), you can add them to the Proposal
            Candidate after its initial publication. We strongly advise against
            modifying the template or the initial transaction that adds the
            encoded trait to the Descriptor, as doing so could result in
            proposing gibberish pixels to the DAO.
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
                {prerequisitesMet && (
                  <>
                    <Divider className="!my-12" />
                    <ChecklistItem
                      isUserTickable
                      id="agreement"
                      isTicked={artContributionAgreementSignature !== undefined}
                      onClick={() => signArtContributionAgreement()}
                      tickableContent={
                        <div className="flex flex-col gap-4">
                          <p className="text-sm text-foreground">
                            You&apos;ll be prompted to sign the following
                            statement releasing your artwork under the{" "}
                            <strong>CC0 license</strong> and agreeing to the
                            Nouns Art Contribution Agreement, which will then be
                            included in the proposal:
                          </p>
                          <Dynamic>
                            <pre className="text-xs p-2 border text-foreground/75 break-words whitespace-pre-wrap">
                              {artContributionAgreementMessage}
                            </pre>
                          </Dynamic>
                          <Button
                            className="w-full"
                            onClick={() => signArtContributionAgreement()}
                          >
                            Sign Nouns Art Contribution Agreement
                          </Button>
                        </div>
                      }
                    >
                      You&apos;ve signed the{" "}
                      <Link
                        href={
                          "https://z5pvlzj323gcssdd3bua3hjqckxbcsydr4ksukoidh3l46fhet4q.arweave.net/z19V5TvWzClIY9hoDZ0wEq4RSwOPFSopyBn2vninJPk"
                        }
                        className="text-blue-500"
                        color="foreground"
                        target="_blank"
                        underline="always"
                      >
                        Nouns Art Contribution Agreement
                      </Link>
                    </ChecklistItem>
                  </>
                )}
              </ul>
              {!address && <ConnectButton />}
            </Dynamic>
          </div>

          {previewTraits &&
            traitBitmap &&
            traitColorsWithoutTransparent &&
            mainnetArtwork && (
              <div className="hidden">
                <canvas ref={setPreviewNounCanvas} />
                <canvas ref={setCircleCropLgCanvas} />

                <TraitOnCheckerboard
                  ref={setStandaloneCanvas}
                  size={128}
                  trait={traitBitmap}
                />

                <TraitPalette
                  ref={setPaletteCanvas}
                  colors={traitColorsWithoutTransparent}
                  className="w-fit h-fit "
                />

                {/* {previewNounsTraits &&
                  previewNounsTraits.map((traits, i) => {
                    return (
                      <Noun
                        canvasRef={(canvas) => setGalleryCanvas(i, canvas)}
                        key={i}
                        margin={2}
                        {...traits}
                        withCheckerboardBg={false}
                        size={96}
                      />
                    );
                  })} */}
              </div>
            )}

          <h2 className="self-center">Your space</h2>
          <div className="bg-content1 max-w-2xl flex flex-col p-10 gap-4 px-7 w-full shadow-md">
            <p>
              This is your space to talk about your trait and whatever else
              you&apos;d like. Tell the DAO why they should incorporate your
              trait into the collection!
            </p>

            <p>
              Markdown is accepted. Avoid links and images that might be
              unavailable in the future.
            </p>

            <p>(You can preview the rendered Markdown below)</p>

            <Textarea
              label="Words from the author"
              defaultValue={wordsFromAuthor}
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
                loadingContent="Submitting"
                isLoading={isProposing}
                disabled={isProposing || !propose || !!proposeTx}
                onClick={() => propose?.()}
              >
                Submit
              </Button>
            </>
          )}

          {proposeTx && (
            <p>
              Transaction submitted.{" "}
              <Link
                href={`https://etherscan.io/tx/0xdfa89f520f33d0d26ad3728121fc9ce020722505e9a0f0903c306d73d2074c80`}
              >
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
