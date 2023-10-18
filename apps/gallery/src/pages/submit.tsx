"use client";

import { Noun } from "@/components/Noun";
import { TraitIcon } from "@/components/TraitIcon";
import { TraitPicker } from "@/components/TraitPicker";
import { TraitTestingGrounds } from "@/components/TraitTestGrounds";
import { useMainnetArtwork } from "@/hooks/useMainnetArtwork";
import { NounTraits } from "@/types/noun";
import { generateSeed } from "@/utils/nouns/generateSeed";
import { getTraitsFromSeed } from "@/utils/nouns/getTraitsFromSeed";
import { formatTraitType } from "@/utils/traits/format";
import { Button } from "@nextui-org/react";
import { useQueryState } from "next-usequerystate";
import {
  IMAGE_TRAIT_TYPES,
  TRAIT_TYPES,
  TraitType,
  isTraitType,
} from "noggles";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { TbArrowBackUp } from "react-icons/tb";

const Submit = () => {
  const [traitType, setTraitType] = useQueryState<TraitType | null>("type", {
    parse: (v) => (isTraitType(v) ? v : null),
    history: "push",
  });
  const [traitCanvas, setTraitCanvas] = useState<HTMLCanvasElement | null>();
  const [traitFile, setTraitFile] = useState<File | null>(null);
  const [traitBitmap, setTraitBitmap] = useState<ImageBitmap | null>(null);
  const formatedTraitType = formatTraitType(traitType);
  const [traits, setTraits] = useState<NounTraits>({
    accessory: `0x00000000`,
    background: `#0000`,
    body: `0x00000000`,
    glasses: `0x00000000`,
    head: `0x00000000`,
  });
  const { data: mainnetArtwork } = useMainnetArtwork();
  useEffect(() => {
    if (!mainnetArtwork || !traitBitmap || !traitType) return;

    setTraits({
      ...getTraitsFromSeed(
        generateSeed(mainnetArtwork, Date.now()),
        mainnetArtwork
      ),
      [traitType]: traitBitmap,
    });
  }, [mainnetArtwork, traitBitmap]);

  const { getRootProps, getInputProps, rootRef } = useDropzone({
    accept: { "image/png": [".png"] },
    maxFiles: 1,
    multiple: false,
    onDropAccepted: ([file]) => setTraitFile(file),
  });

  useEffect(() => {
    if (!traitFile || !traitCanvas) return;
    const reader = new FileReader();
    reader.onload = function () {
      const img = new Image();
      img.onload = () => {
        const ctx = traitCanvas?.getContext("2d");
        if (!ctx) return;
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, 32, 32);
        ctx.drawImage(img, 0, 0, 32, 32);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(traitFile);
  }, [traitFile, traitCanvas]);

  return (
    <div className="container w-full max-w-4xl mx-auto px-4 gap-4 lg:gap-32 items-center flex flex-col py-4 pt-8">
      <h1 className="font-Pix text-lg xl:text-4xl sm:text-lg lg:text-2xl">
        Submit {formatTraitType(traitType)}
      </h1>

      {traitType === null && (
        <div className="grid w-full max-w-2xl grid-cols-2 items-center justify-center gap-2 xs:gap-4 sm:gap-6 md:gap-8 text-black">
          {[...IMAGE_TRAIT_TYPES].map((traitType) => (
            <button
              className="w-full flex flex-col bg-content1 items-center justify-between p-4 hover:text-primary"
              onClick={() => setTraitType(traitType)}
            >
              <TraitIcon
                type={traitType}
                className="w-12 h-12 md:w-[72px] md:h-[72px]"
              />
              <p className="uppercase text-sm font-semibold ">{traitType}</p>
            </button>
          ))}
        </div>
      )}

      {traitType !== null && traitBitmap === null && (
        <>
          <Button
            radius="none"
            variant="bordered"
            className="self-start"
            onClick={() => setTraitType(null)}
            endContent={<TbArrowBackUp />}
          >
            Back
          </Button>
          <div className="w-full max-w-2xl flex flex-col items-center justify-center gap-2 ">
            <div
              {...getRootProps()}
              className="bg-content3 cursor-pointer flex flex-col min-h-[200px] gap-4 p-6 items-center justify-center"
            >
              <input {...getInputProps()} />
              <p className="text-center ">
                {traitFile
                  ? `Drop another ${formatedTraitType} here to replace, or click to select a file`
                  : `Drop your ${formatedTraitType} here, or click to select a file`}
              </p>
              <canvas
                ref={setTraitCanvas}
                className="w-[128px] h-[128px] bg-checkerboard border-2 border-gray-400 box-content"
                style={{ display: !traitFile ? "none" : undefined }}
                width={32}
                height={32}
              />
            </div>

            {!!traitFile && (
              <Button
                onClick={async () => {
                  const ctx = traitCanvas?.getContext("2d");
                  if (!ctx) return;
                  setTraitBitmap(
                    await createImageBitmap(ctx.getImageData(0, 0, 32, 32))
                  );
                }}
              >
                Next
              </Button>
            )}
          </div>
        </>
      )}

      {traitType !== null && traitBitmap !== null && (
        <>
          <Button
            radius="none"
            variant="bordered"
            className="self-start"
            onClick={() => {
              setTraitBitmap(null);
              setTraitFile(null);
            }}
            endContent={<TbArrowBackUp />}
          >
            Back
          </Button>
          <div className="w-full max-w-2xl flex flex-col items-center justify-center gap-2">
            <div className="flex flex-col p-4 bg-content1 gap-2 items-center">
              <p className="text-md upper font-bold text-gray-500 text-center">
                Accessorize your Noun
              </p>
              <div className=" flex gap-3">
                <Noun {...traits} size={192} />
                <div className="flex flex-col justify-between">
                  {TRAIT_TYPES.filter((type) => traitType !== type).map(
                    (type) => (
                      <TraitPicker
                        currentTraits={traits}
                        key={`${type}-picker`}
                        traitType={type}
                        onPick={setTraits}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
            <TraitTestingGrounds
              title="Or pick a premade"
              onNounClick={(seed) => {
                if (!mainnetArtwork || !traitBitmap || !traitType) return;

                setTraits({
                  ...getTraitsFromSeed(seed, mainnetArtwork),
                  [traitType]: traitBitmap,
                });
              }}
              traitType={traitType}
              trait={traitBitmap}
              className="w-full h-[484px]"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Submit;
