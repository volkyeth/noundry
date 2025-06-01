/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { Trait } from "@/types/trait";
import { UserInfo } from "@/types/user";
import { resizePng } from "@/utils/image/resize";
import { formatSubmissionType } from "@/utils/traits/format";
import { appConfig } from "@/variants/config";
import { ImageResponse } from "@vercel/og";
import { NextResponse } from "next/server";
import { SubmissionCategory } from "@/types/submission";
const { theme } = appConfig;
export async function GET(req: Request, { params: { id } }) {
  const baseUri = `${
    process.env.NODE_ENV === "production" ? "https" : "http"
  }://${req.headers.get("host")}`;

  const trait = (await fetch(`${baseUri}/api/trait/${id}`).then((r) =>
    r.json(),
  )) as Trait;

  if (!trait) {
    return NextResponse.json("Not found", { status: 404 });
  }

  const upscaledNounImage = await resizePng(trait.nft, 384, 384);

  const authorInfo = (await fetch(
    `${baseUri}/api/user/${trait.address}/info`,
  ).then((r) => r.json())) as UserInfo;

  const inter700 = await fetch(`${baseUri}/fonts/inter-700.ttf`).then((res) =>
    res.arrayBuffer(),
  );
  const inter600 = await fetch(`${baseUri}/fonts/inter-600.ttf`).then((res) =>
    res.arrayBuffer(),
  );
  const inter400 = await fetch(`${baseUri}/fonts/inter-400.ttf`).then((res) =>
    res.arrayBuffer(),
  );

  return new ImageResponse(
    (
      <div tw="flex flex-row w-full p-16 pr-30  h-full items-center justify-between bg-[#f5f5f5]">
        <div tw="flex flex-col flex-grow justify-between pr-20 pt-24  items-start h-full ">
          <div tw="flex flex-col text-4xl leading-8">
            <h1 tw="m-0 font-semibold">Let there be</h1>
            <h1 tw={`m-0 font-semibold text-[${theme.primary.DEFAULT}]`}>
              Lils
            </h1>
          </div>
          <svg
            width={420}
            viewBox="0 0 560 190"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="560" height="190" fill="#7CC4F2" />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M59.9999 60H79.9999V79.9999H40V40H59.9999V60Z"
              fill="#FF638D"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M90 40H110V79.9999H90V40Z"
              fill="#FFEF16"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M140 60H160V79.9999H120V40H140V60Z"
              fill="#2B83F6"
            />
            <path d="M40 150V90H100V150H80V110H60V150H40Z" fill="white" />
            <path
              d="M110 150V90H170V150H110ZM130 130H150V110H130V130Z"
              fill="white"
            />
            <path d="M180 150V90H200V130H220V90H240V150H180Z" fill="white" />
            <path d="M250 150V90H310V150H290V110H270V150H250Z" fill="white" />
            <path
              d="M320 150V90H360V110H380V130H360V150H320ZM340 130H360V110H340V130Z"
              fill="white"
            />
            <path
              d="M390 150V90H430V110H450V150H430V130H410V110L410 150H390Z"
              fill="white"
            />
            <path
              d="M481 149V129H461V89H481V109H501V99V89H521V129H501V149H481Z"
              fill="white"
            />
          </svg>
        </div>
        <div
          tw="px-6 py-8 flex flex-col bg-white"
          style={{ boxShadow: "0 8px #e5e7eb" }}
        >
          <div tw="flex">
            <div tw="flex flex-col justify-between">
              <h1 tw="text-10 m-0">{trait.name}</h1>
              <h2 tw="uppercase text-7 font-700 m-0 text-gray-400 tracking-wider">
                {formatSubmissionType(trait.type)}
              </h2>
            </div>
            <div tw="flex ml-4">
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
    },
  );
}

const TraitIcon = ({ type }: { type: SubmissionCategory }) => {
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
    case "nouns":
      return (
        <svg width={48} height={48} viewBox="0 0 24 24" fill="#d4d4d9">
          <rect x="9" y="4" width="2" height="4" />
          <path d="M19,22L8,22L8,17L7,17L7,22L5,22L5,13L19,13L19,22Z" />
          <rect x="16" y="4" width="2" height="4" />
          <path d="M12,6L12,9L6,9L6,6L4,6L4,12L20,12L20,2L4,2L4,5L6,5L6,3L12,3L12,5L13,5L13,3L19,3L19,9L13,9L13,6L12,6Z" />
        </svg>
      );
    default:
      return null;
  }
};
