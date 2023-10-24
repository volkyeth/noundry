import { Trait } from "@/types/trait";
import { UserInfo } from "@/types/user";
import { formatTraitType } from "@/utils/traits/format";
import { ImageResponse } from "@vercel/og";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: Request, { params: { id } }) {
  const baseUri = `${
    process.env.NODE_ENV === "production" ? "https" : "http"
  }://${req.headers.get("host")}`;

  const trait = (await fetch(`${baseUri}/api/trait/${id}/upscaled`).then((r) =>
    r.json()
  )) as Trait;

  if (!trait) {
    return NextResponse.json("Not found", { status: 404 });
  }

  const authorInfo = (await fetch(
    `${baseUri}/api/user/${trait.address}/info`
  ).then((r) => r.json())) as UserInfo;

  const inter700 = await fetch(`${baseUri}/fonts/inter-700.ttf`).then((res) =>
    res.arrayBuffer()
  );
  const inter400 = await fetch(`${baseUri}/fonts/inter-400.ttf`).then((res) =>
    res.arrayBuffer()
  );

  return new ImageResponse(
    (
      <div tw="flex w-full p-8 px-36 h-full items-center justify-between bg-[#f5f5f5]">
        <div tw="flex flex-col text-16 self-end tracking-widest">
          <p tw=" m-0">NOUNDRY</p>
          <p tw="m-0">GALLERY</p>
        </div>
        <div tw="px-6 py-8 flex flex-col w-[368px]  bg-white">
          <div tw="flex">
            <div tw="flex flex-col justify-between">
              <h1 tw="text-8 m-0">{trait.name}</h1>
              <h2 tw="uppercase text-5 font-700 m-0 text-[#d4d4d9] tracking-wider">
                {formatTraitType(trait.type)}
              </h2>
            </div>
            <div tw="flex absolute right-0">
              <svg viewBox="4 4 16 16" width={32} height={32} fill="#d4d4d9">
                <rect x="9" y="10" width="2" height="4" />
                <rect x="16" y="10" width="2" height="4" />
                <path d="M20,19L20,4L4,4L4,11L6,11L6,9L12,9L12,11L13,11L13,9L19,9L19,15L13,15L13,12L12,12L12,15L6,15L6,12L4,12L4,19L20,19Z" />
              </svg>
            </div>
          </div>
          <img tw="mt-2 " src={trait.nft} />
          <p tw="m-0 mt-2 text-[#d4d4d9] font-semibold">by</p>
          <p tw="m-0 font-semibold">{authorInfo.userName}</p>
          <div tw="flex self-end font-bold gap-2 text-[#d4d4d9] items-baseline">
            <svg
              viewBox="4 8 16 7"
              width={32}
              fill="#d4d4d9"
              fillRule="evenodd"
            >
              <path d="M13,11L13,9L7,9L7,11L4,11L4,14L5,14L5,12L7,12L7,15L13,15L13,12L14,12L14,15L20,15L20,9L14,9L14,11L13,11ZM15,10L15,14L17,14L17,10L15,10ZM8,10L8,14L10,14L10,10L8,10Z" />
            </svg>
            <p tw="m-0 ml-2 self-end">{trait.likesCount}</p>
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
          weight: 400,
          data: inter400,
        },
      ],
    }
  );
}

{
  /* <div tw="flex p-4 xs:p-6 rounded-none shadow-none w-fit h-fit flex-shrink-0">
  <div tw="flexp-0 pb-1 flex-row  justify-between w-full items-start gap-0 rounded-none">
    <div tw="flex flex-col items-start ">
      <h1 tw="font-Inter text-secondary font-bold text-2xl">{trait.name}</h1>
      <small tw="text-default-300 text-tiny xs:text-medium uppercase font-bold tracking-wider">
        {formatTraitType(trait.type)}
      </small>
    </div>
  </div>
  <div tw="overflow-visible items-center p-0 w-fit">
    <div tw="grid  w-[256px]  h-[256px] xs:w-[320px] xs:h-[320px] bg-checkerboard">
      <div tw="flex row-start-1 row-end-1 col-start-1 col-end-1 pixelated">
        {trait.nft}
      </div>
    </div>
  </div>
</div>; */
}
