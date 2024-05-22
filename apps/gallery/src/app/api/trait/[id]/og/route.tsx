/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { Trait } from "@/types/trait";
import { UserInfo } from "@/types/user";
import { formatTraitType } from "@/utils/traits/format";
import { ImageResponse } from "@vercel/og";
import { NextResponse } from "next/server";
import { TraitCategory } from "noggles";
//@ts-ignore
import noundryGalleryLogo from "@/assets/NoundryGalleryLogo.svg?url";
import { resizePng } from "@/utils/image/resize";

export async function GET(req: Request, { params: { id } }) {
  const baseUri = `${
    process.env.NODE_ENV === "production" ? "https" : "http"
  }://${req.headers.get("host")}`;

  const trait = (await fetch(`${baseUri}/api/trait/${id}`).then((r) =>
    r.json()
  )) as Trait;

  if (!trait) {
    return NextResponse.json("Not found", { status: 404 });
  }

  const upscaledNounImage = await resizePng(trait.nft, 384, 384);

  const authorInfo = (await fetch(
    `${baseUri}/api/user/${trait.address}/info`
  ).then((r) => r.json())) as UserInfo;

  const inter700 = await fetch(`${baseUri}/fonts/inter-700.ttf`).then((res) =>
    res.arrayBuffer()
  );
  const inter600 = await fetch(`${baseUri}/fonts/inter-600.ttf`).then((res) =>
    res.arrayBuffer()
  );
  const inter400 = await fetch(`${baseUri}/fonts/inter-400.ttf`).then((res) =>
    res.arrayBuffer()
  );

  return new ImageResponse(
    (
      <div tw="flex flex-row w-full p-16 pr-30  h-full items-center justify-between bg-[#f5f5f5]">
        <div tw="flex flex-col flex-grow justify-between pr-20 pt-24  items-start h-full ">
          <div tw="flex flex-col text-4xl leading-8">
            <h1 tw="m-0 font-semibold">Let there be</h1>
            <h1 tw="m-0 font-semibold text-[#ff2165]">Nouns</h1>
          </div>
          <img
            src={`${baseUri}${noundryGalleryLogo.src}`}
            width={420}
            height={108}
          />
        </div>
        <div
          tw="px-6 py-8 flex flex-col bg-white"
          style={{ boxShadow: "0 8px #e5e7eb" }}
        >
          <div tw="flex">
            <div tw="flex flex-col justify-between">
              <h1 tw="text-10 m-0">{trait.name}</h1>
              <h2 tw="uppercase text-7 font-700 m-0 text-gray-400 tracking-wider">
                {formatTraitType(trait.type)}
              </h2>
            </div>
            <div tw="flex absolute right-0">
              <TraitIcon type={trait.type} />
            </div>
          </div>
          <img tw="mt-2 w-[384px] h-[384px] " src={upscaledNounImage} />
          <div tw="flex self-end items-center mt-6">
            <p tw="m-0  text-3xl font-semibold leading-6">
              {authorInfo.userName}
            </p>
          </div>
        </div>
      </div>
    ),
    {
      // debug: true,
      fonts: [
        {
          name: "Inter",
          weight: 700,
          data: inter700,
        },
        {
          name: "Inter",
          weight: 600,
          data: inter600,
        },
        {
          name: "Inter",
          weight: 400,
          data: inter400,
        },
      ],
    }
  );
}

const TraitIcon = ({ type }: { type: TraitCategory }) => {
  switch (type) {
    case "accessories":
      return (
        <svg width={48} height={48} viewBox="4 4 16 16" fill="#d4d4d9">
          <path d="M8,4L12,4L12,6L10,6L10,8L8,8L8,4ZM12,8L12,6L14,6L14,4L16,4L16,8L12,8Z" />
          <rect x="6" y="10" width="4" height="4" />
          <path d="M8,16L12,16L12,18L10,18L10,20L8,20L8,16ZM12,20L12,18L14,18L14,16L16,16L16,20L12,20Z" />
          <path d="M12,14L12,10L14,10L14,12L16,12L16,10L18,10L18,14L12,14Z" />
        </svg>
      );
    case "heads":
      return (
        <svg width={48} height={48} viewBox="4 4 16 16" fill="#d4d4d9">
          <rect x="9" y="10" width="2" height="4" />
          <rect x="16" y="10" width="2" height="4" />
          <path d="M20,19L20,4L4,4L4,11L6,11L6,9L12,9L12,11L13,11L13,9L19,9L19,15L13,15L13,12L12,12L12,15L6,15L6,12L4,12L4,19L20,19Z" />
        </svg>
      );
    case "bodies":
      return (
        <svg width={48} height={48} viewBox="4 4 16 16" fill="#d4d4d9">
          <path d="M8,18L8,11L7,11L7,18L5,18L5,7L19,7L19,18L8,18Z" />
        </svg>
      );
    case "glasses":
      return (
        <svg
          width={48}
          height={48}
          viewBox="4 4 16 16"
          fill="#d4d4d9"
          fillRule="evenodd"
        >
          <path d="M13,11L13,9L7,9L7,11L4,11L4,14L5,14L5,12L7,12L7,15L13,15L13,12L14,12L14,15L20,15L20,9L14,9L14,11L13,11ZM15,10L15,14L17,14L17,10L15,10ZM8,10L8,14L10,14L10,10L8,10Z" />
        </svg>
      );
    case "backgrounds":
      return (
        <svg width={48} height={48} viewBox="4 4 16 16">
          <path
            fill="#d4d4d9"
            d="M17,6L20,6L20,19L7,19L7,17L4,17L4,4L17,4L17,6ZM8,7L8,18L19,18L19,7L8,7Z"
          />
        </svg>
      );
  }
};
