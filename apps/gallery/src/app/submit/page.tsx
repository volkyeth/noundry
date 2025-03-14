"use client";

import { BraveDisclaimer } from "@/components/BraveDisclaimer";
import { Button } from "@/components/Button";
import Dynamic from "@/components/Dynamic";
import { ModelPicker } from "@/components/ModelPicker";
import { Noun } from "@/components/Noun";
import { TraitCard } from "@/components/TraitCard";
import { TraitIcon } from "@/components/TraitIcon";
import { TraitPicker } from "@/components/TraitPicker";
import { MAX_TRAIT_NAME_LENGTH } from "@/constants/trait";
import { useMainnetArtwork } from "@/hooks/useMainnetArtwork";
import { useSignedInMutation } from "@/hooks/useSignedInMutation";
import { useTraitBitmap } from "@/hooks/useTraitBitmap";
import { AddTraitQuery } from "@/schemas/addTraitQuery";
import { generateSeed } from "@/utils/nouns/generateSeed";
import { getTraitsFromSeed } from "@/utils/nouns/getTraitsFromSeed";
import { formatTraitType } from "@/utils/traits/format";
import { Input } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  isTraitType,
  NounSeed,
  NounTraits,
  TRAIT_TYPES,
  TraitType,
} from "noggles";
import { useQueryState } from "nuqs";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { RiArrowGoBackFill } from "react-icons/ri";

export default function Submit() {
  return (
    <Suspense>
      <InnerSubmit />
    </Suspense>
  );
}

function InnerSubmit() {
  const [traitType, setTraitType] = useQueryState<TraitType | null>("type", {
    parse: (v) => (isTraitType(v) ? v : null),
    history: "push",
  });
  const searchParams = useSearchParams();
  const router = useRouter();
  const [traitCanvas, setTraitCanvas] = useState<HTMLCanvasElement | null>();
  const [traitFile, setTraitFile] = useState<File | null>(null);
  const [traitBitmap, setTraitBitmap] = useState<ImageBitmap | null>(null);
  const formatedTraitType = formatTraitType(traitType);
  const [traitName, setTraitName] = useState<string>("");
  const [seedInitialized, setSeedInitialized] = useState(false);
  const [seed, setSeed] = useState<NounSeed>({
    accessory: 0,
    background: 0,
    body: 0,
    glasses: 0,
    head: 0,
  });

  // Handle image data URL from query parameters
  useEffect(() => {
    if (!traitType) return;
    const imageData = searchParams.get(traitType);
    if (!imageData?.startsWith("data:")) return;

    const tmpImage = new Image();
    tmpImage.onload = () => {
      createImageBitmap(tmpImage).then((bitmap) => {
        setTraitBitmap(bitmap);
        const ctx = traitCanvas?.getContext("2d")!;
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, 32, 32);
        ctx.drawImage(tmpImage, 0, 0, 32, 32);
        tmpImage.remove();
      });
    };
    tmpImage.src = imageData;

    // Helper function to check if a value is numeric
    const isNumeric = (s: string | null) => s && Number.isFinite(+s);

    // Update seed values from query parameters
    setSeed((prev) => ({
      accessory: isNumeric(searchParams.get("accessory"))
        ? Number(searchParams.get("accessory"))
        : prev.accessory,
      background: isNumeric(searchParams.get("background"))
        ? Number(searchParams.get("background"))
        : prev.background,
      body: isNumeric(searchParams.get("body"))
        ? Number(searchParams.get("body"))
        : prev.body,
      glasses: isNumeric(searchParams.get("glasses"))
        ? Number(searchParams.get("glasses"))
        : prev.glasses,
      head: isNumeric(searchParams.get("head"))
        ? Number(searchParams.get("head"))
        : prev.head,
    }));

    setSeedInitialized(true);

    // Clean up the URL to only keep the type parameter
    router.replace(`/submit?type=${traitType}`);
  }, [searchParams, traitType, router, traitCanvas]);

  const { data: mainnetArtwork } = useMainnetArtwork();
  useEffect(() => {
    if (!mainnetArtwork || seedInitialized) return;
    setSeed(generateSeed(mainnetArtwork, Math.random()));
    setSeedInitialized(true);
  }, [mainnetArtwork, seedInitialized]);
  const traits = useMemo<NounTraits>(() => {
    if (!mainnetArtwork || !traitBitmap || !traitType)
      return {
        accessory: `0x00000000`,
        background: `#0000`,
        body: `0x00000000`,
        glasses: `0x00000000`,
        head: `0x00000000`,
      };

    return {
      ...getTraitsFromSeed(seed, mainnetArtwork),
      [traitType]: traitBitmap,
    };
  }, [mainnetArtwork, traitBitmap, seed, traitType]);

  const accessoryBitmap = useTraitBitmap(traits.accessory);
  const bodyBitmap = useTraitBitmap(traits.body);
  const glassesBitmap = useTraitBitmap(traits.glasses);
  const headBitmap = useTraitBitmap(traits.head);

  const { mutate: submit, isPending: isSubmitting } = useSignedInMutation({
    mutationFn: () => {
      if (
        !traitBitmap ||
        !accessoryBitmap ||
        !bodyBitmap ||
        !glassesBitmap ||
        !headBitmap
      )
        throw new Error("Missing trait bitmap");

      const traitCanvas = document.createElement("canvas");
      traitCanvas.width = 32;
      traitCanvas.height = 32;
      const traitCtx = traitCanvas.getContext("2d")!;
      traitCtx.drawImage(traitBitmap, 0, 0);
      const traitImage = traitCanvas.toDataURL("image/png");

      const previewCanvas = document.createElement("canvas");
      previewCanvas.width = 32;
      previewCanvas.height = 32;
      const previewCtx = previewCanvas.getContext("2d")!;
      previewCtx.fillStyle = traits.background;
      previewCtx.fillRect(0, 0, 32, 32);

      previewCtx.drawImage(
        traitType === "body" ? traitBitmap : bodyBitmap,
        0,
        0,
      );
      previewCtx.drawImage(
        traitType === "accessory" ? traitBitmap : accessoryBitmap,
        0,
        0,
      );
      previewCtx.drawImage(
        traitType === "head" ? traitBitmap : headBitmap,
        0,
        0,
      );
      previewCtx.drawImage(
        traitType === "glasses" ? traitBitmap : glassesBitmap,
        0,
        0,
      );

      const previewImage = previewCanvas.toDataURL("image/png");

      return fetch("/api/trait", {
        method: "POST",
        body: JSON.stringify({
          name: traitName,
          traitType,
          traitImage,
          previewImage,
        } as AddTraitQuery),
      }).then((res) => res.json() as Promise<{ id: number }>);
    },
    onSuccess: ({ id }) => {
      router.push(`/trait/${id}`);
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/png": [".png"] },
    maxFiles: 1,
    multiple: false,
    onDropAccepted: ([file]) => setTraitFile(file),
  });

  useEffect(() => {
    if (!traitFile || !traitCanvas) return;
    const reader = new FileReader();
    reader.onload = function () {
      console.log("reader.result", reader.result);
      const img = new Image();
      img.onload = () => {
        const ctx = traitCanvas.getContext("2d")!;
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, 32, 32);
        ctx.drawImage(img, 0, 0, 32, 32);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(traitFile);
  }, [traitFile, traitCanvas]);

  useEffect(() => {
    if (!traitBitmap || !traitCanvas) return;

    const ctx = traitCanvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 32, 32);
    ctx.drawImage(traitBitmap, 0, 0, 32, 32);
  }, [traitBitmap, traitCanvas]);

  return (
    <>
      <BraveDisclaimer />
      <Dynamic>
        <div className="container w-full max-w-6xl mx-auto px-2 sm:px-4 gap-8 md:gap-12 items-center flex flex-col flex-grow py-4 pt-8">
          <h1>Submit {formatTraitType(traitType) || "trait"}</h1>

          {traitType === null && (
            <div className="grid w-full max-w-2xl grid-cols-1 xs:grid-cols-2  items-center justify-center gap-2 xs:gap-4 sm:gap-6 md:gap-8 text-black">
              {["head", "accessory", "glasses", "body"].map(
                (traitType: TraitType) => (
                  <Button
                    key={`select-type-${traitType}`}
                    variant="secondary"
                    className="w-full h-fit flex flex-col items-center p-8"
                    onClick={() => setTraitType(traitType)}
                  >
                    <TraitIcon
                      type={traitType}
                      negative
                      className="w-12 h-12 md:w-[72px] md:h-[72px]"
                    />
                    <p className="uppercase mt-4 text-sm font-semibold ">
                      {formatTraitType(traitType)}
                    </p>
                  </Button>
                ),
              )}
            </div>
          )}

          {traitType !== null && traitBitmap === null && (
            <>
              <div className="w-full max-w-xl flex flex-col items-center justify-center gap-2 ">
                <Button
                  variant="ghost"
                  className="self-start px-2 py-1"
                  onClick={() => {
                    setTraitType(null);
                    setTraitFile(null);
                  }}
                >
                  <RiArrowGoBackFill className="text-2xl" />
                </Button>
                <div
                  {...getRootProps()}
                  className="bg-content3 cursor-pointer flex flex-col min-h-[400px] w-full gap-10 p-6 items-center justify-center shadow-inset shadow-default-300"
                >
                  <input {...getInputProps()} />
                  <p className="text-center ">
                    {isDragActive
                      ? `Drop your ${formatedTraitType} here`
                      : traitFile
                      ? `Drop another ${formatedTraitType} here to replace, or click to select a file`
                      : `Drop your ${formatedTraitType} here, or click to select a file`}
                  </p>
                  <canvas
                    ref={setTraitCanvas}
                    className="w-[128px] h-[128px] bg-checkerboard border-1 box-content shadow-xs shadow-default-300"
                    style={{ display: !traitFile ? "none" : undefined }}
                    width={32}
                    height={32}
                  />
                  {traitFile && (
                    <Button
                      className="w-48"
                      onClick={async (e) => {
                        e.stopPropagation();
                        const ctx = traitCanvas?.getContext("2d");
                        if (!ctx) return;
                        setTraitBitmap(
                          await createImageBitmap(
                            ctx.getImageData(0, 0, 32, 32),
                          ),
                        );
                      }}
                    >
                      NEXT
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}

          {traitType !== null && traitBitmap !== null && (
            <>
              <div className="w-full flex flex-col gap-4 items-center justify-center ">
                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    className="self-start px-2 py-1"
                    onClick={() => {
                      setTraitBitmap(null);
                      setTraitFile(null);
                      setTraitName("");
                    }}
                  >
                    <RiArrowGoBackFill className="text-2xl" />
                  </Button>
                  <TraitCard
                    name={
                      <Input
                        variant="underlined"
                        autoFocus
                        value={traitName}
                        onChange={(e) =>
                          setTraitName(
                            e.target.value.charAt(0).toUpperCase() +
                              e.target.value.slice(1),
                          )
                        }
                        maxLength={MAX_TRAIT_NAME_LENGTH}
                        fullWidth={false}
                        classNames={{
                          input:
                            "font-bold text-xl xs:text-2xl text-secondary placeholder:text-gray-200 placeholder:border-1 underline  decoration-default-200",
                          inputWrapper:
                            "!p-0 min-h-0 h-6 xs:h-7 w-52 xs:w-[252px] !border-none shadow-none after:hidden",
                        }}
                        isRequired
                        disableAnimation
                        placeholder="Name goes here"
                      />
                    }
                    type={traitType}
                    image={
                      <Noun
                        {...{ [traitType]: traitBitmap }}
                        withCheckerboardBg
                        size={32}
                        className="w-full"
                      />
                    }
                    previewImage={
                      <Noun {...traits} size={32} className="w-full" />
                    }
                    footer={
                      <div className="flex flex-col gap-0 pt-1 xs:p2-2 w-full  items-end justify-between">
                        <div className="w-full flex text-xs text-default font-bold justify-between tracking-widest">
                          <p>PICK</p>
                          <p>CUSTOMIZE</p>
                        </div>
                        <div className="w-full flex gap-2 justify-between">
                          <ModelPicker
                            variant="secondary"
                            classNames={{
                              button: "px-2",
                              icon: "w-[24px] h-[24px] ",
                            }}
                            trait={traitBitmap}
                            traitType={traitType}
                            onPick={setSeed}
                          />
                          <div className="flex gap-[2px] items-center">
                            {TRAIT_TYPES.filter(
                              (type) => traitType !== type,
                            ).map((type) => (
                              <TraitPicker
                                variant="secondary"
                                classNames={{
                                  button: "p-3",
                                  icon: "w-[16px] h-[16px] ",
                                }}
                                currentTraits={traits}
                                key={`${type}-picker`}
                                traitType={type}
                                onPick={(traitIndex) =>
                                  setSeed({ ...seed, [type]: traitIndex })
                                }
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    }
                  />
                  <Button
                    className="flex-grow w-full"
                    onClick={() => submit()}
                    isDisabled={traitName === ""}
                    isLoading={isSubmitting}
                    loadingContent="Submitting"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Dynamic>
    </>
  );
}
