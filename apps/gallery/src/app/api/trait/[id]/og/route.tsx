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
  const inter600 = await fetch(`${baseUri}/fonts/inter-600.ttf`).then((res) =>
    res.arrayBuffer()
  );
  const inter400 = await fetch(`${baseUri}/fonts/inter-400.ttf`).then((res) =>
    res.arrayBuffer()
  );

  return new ImageResponse(
    (
      <div tw="flex flex-row w-full p-16  h-full items-center justify-between bg-[#f5f5f5]">
        <div tw="flex flex-col flex-grow justify-between pr-20 pt-24  items-start h-full ">
          <div tw="flex flex-col text-4xl leading-8">
            <h1 tw="m-0 font-semibold">Let there be</h1>
            <h1 tw="m-0 font-semibold text-[#ff2165]">Nouns</h1>
          </div>
          <svg height={108} viewBox="0 0 700 180">
            <path fill="#fff" d="M10 10h200v160H10z" />
            <path fill="black" d="M0 180V0h220v180H0Zm20-20h180V20H20v140Z" />
            <path fill="#e3e3e3" d="M30 30h160v120H30z" />
            <path fill="#fff" d="M130 70h20v40h-20zM60 70h20v40H60z" />
            <path fill="black" d="M150 70h20v40h-20zM80 70h20v40H80z" />
            <path
              fill="#ff2165"
              d="M110 80h10V60h60v60h-60V90h-10v30H50V90H30v20H20V80h30V60h60v20Zm-50 30h40V70H60v40Zm70 0h40V70h-40v40Z"
            />
            <g fill="black">
              <path d="M307.9 73.4h-10.6l-24.1-36.1v36.1h-10.6V20.7h10.6l24 36.2V20.7H308v52.7Z" />
              <path d="M354.3 74c-5 0-9.5-1.2-13.6-3.5a26.6 26.6 0 0 1-13.5-23.6 26 26 0 0 1 13.5-23.5c4.1-2.3 8.7-3.4 13.6-3.4a26.4 26.4 0 0 1 27 27A25.7 25.7 0 0 1 368 70.5a27.4 27.4 0 0 1-13.6 3.4Zm0-9.5c3.2 0 6-.7 8.4-2.2 2.5-1.4 4.4-3.4 5.7-6a20 20 0 0 0 2-9.4 20 20 0 0 0-2-9.2 14.6 14.6 0 0 0-5.7-6 16.2 16.2 0 0 0-8.4-2.2c-3.2 0-6 .7-8.4 2.1a14.3 14.3 0 0 0-5.8 6 20 20 0 0 0-2 9.3c0 3.6.7 6.7 2 9.3 1.4 2.7 3.3 4.7 5.8 6.1 2.4 1.5 5.2 2.2 8.4 2.2Z" />
              <path d="M411.1 20.8v32.6c0 3.5 1 6.2 2.8 8.1 2 2 4.5 2.9 8 2.9 3.4 0 6-1 8-2.9 1.8-1.9 2.7-4.6 2.7-8.1V20.8h10.7v32.5a18.9 18.9 0 0 1-10.7 18.3 24.9 24.9 0 0 1-11 2.4c-3.9 0-7.4-.8-10.6-2.4a18 18 0 0 1-7.7-7c-1.9-3-2.8-6.9-2.8-11.3V20.8h10.6Z" />
              <path d="M510.2 73.4h-10.6l-24-36.1v36.1h-10.7V20.7h10.7l24 36.2V20.7h10.6v52.7Z" />
              <path d="M550.6 20.8c5.5 0 10.5 1 14.7 3.2a24 24 0 0 1 9.8 9.2c2.3 4 3.4 8.7 3.4 14a27 27 0 0 1-3.4 13.8 24 24 0 0 1-9.8 9.2 31.8 31.8 0 0 1-14.7 3.2h-18.5V20.8h18.5Zm-.4 43.7c5.6 0 9.9-1.5 13-4.6 3-3 4.5-7.2 4.5-12.7 0-5.5-1.5-9.8-4.6-13-3-3-7.3-4.5-12.9-4.5h-7.5v34.8h7.5Z" />
              <path d="M625.2 73.4 613.5 53h-5v20.5h-10.6V20.8h19.8c4.1 0 7.6.6 10.5 2 2.9 1.5 5.1 3.5 6.5 5.9a16 16 0 0 1 2.2 8.2 15.4 15.4 0 0 1-12 15.2l12.6 21.3h-12.3ZM608.5 45h8.9c2.9 0 5-.7 6.4-2.1 1.5-1.4 2.1-3.3 2.1-5.8 0-2.4-.6-4.3-2-5.6-1.5-1.3-3.6-2-6.5-2h-9V45Z" />
              <path d="M700 20.8 682 55v18.3h-10.5V55.1l-18-34.3h12l11.4 24 11.3-24H700Z" />
              <path d="M299.5 122.7c-1.3-2.2-3-4-5-5a15.7 15.7 0 0 0-7.5-1.8c-3.1 0-6 .7-8.3 2.1a14.6 14.6 0 0 0-5.7 6c-1.4 2.7-2 5.7-2 9.1 0 3.6.6 6.6 2 9.2 1.4 2.7 3.3 4.6 5.8 6a17 17 0 0 0 8.7 2.2c4 0 7.3-1 10-3.3 2.5-2 4.2-5 5-8.9h-18.2v-8H313v9.2A26.2 26.2 0 0 1 287 160c-5.1 0-9.7-1.1-13.8-3.5a24.5 24.5 0 0 1-9.7-9.5c-2.4-4-3.6-8.7-3.6-13.9 0-5.2 1.2-9.8 3.6-14 2.3-4 5.5-7.2 9.7-9.5 4-2.3 8.6-3.4 13.7-3.4 6 0 11.2 1.4 15.6 4.3 4.4 3 7.4 7 9 12.2h-12.1Z" />
              <path d="M364.7 149.5h-21l-3.6 10H329l19-52.7h12.4l19 52.7h-11.2l-3.5-10Zm-2.9-8.4-7.6-22-7.7 22h15.3Z" />
              <path d="M408.6 151.2H426v8.3h-28V107h10.6v44.3Z" />
              <path d="M454.8 151.2h17.4v8.3h-28V107h10.6v44.3Z" />
              <path d="M501 115.4v13.2h17.8v8.4H501v14h20v8.5h-30.6v-52.7H521v8.6H501Z" />
              <path d="M569.4 159.5 557.7 139h-5v20.5h-10.6V107H562c4 0 7.6.6 10.5 2 2.8 1.5 5 3.5 6.5 5.9a16 16 0 0 1 2.1 8.2 15.4 15.4 0 0 1-12 15.2l12.6 21.3h-12.3Zm-16.7-28.4h8.9c2.9 0 5-.7 6.5-2.1 1.4-1.4 2-3.3 2-5.8 0-2.4-.6-4.3-2-5.6-1.5-1.3-3.6-2-6.5-2h-8.9v15.5Z" />
              <path d="m644.2 106.9-17.9 34.3v18.3h-10.6v-18.3l-18-34.3h12l11.4 24 11.3-24h11.8Z" />
            </g>
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
                {formatTraitType(trait.type)}
              </h2>
            </div>
            <div tw="flex absolute right-0">
              <svg viewBox="4 4 16 16" width={48} height={48} fill="#d4d4d9">
                <rect x="9" y="10" width="2" height="4" />
                <rect x="16" y="10" width="2" height="4" />
                <path d="M20,19L20,4L4,4L4,11L6,11L6,9L12,9L12,11L13,11L13,9L19,9L19,15L13,15L13,12L12,12L12,15L6,15L6,12L4,12L4,19L20,19Z" />
              </svg>
            </div>
          </div>
          <img tw="mt-2 w-[384px] h-[384px] " src={trait.nft} />
          {/* <p tw="m-0 mt-2 text-[#d4d4d9] font-semibold">by</p> */}
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
