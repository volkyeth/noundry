import { ImageResponse } from "@vercel/og";
//@ts-ignore

export const runtime = "edge";

export async function GET(req: Request) {
  const baseUri = `${
    process.env.NODE_ENV === "production" ? "https" : "http"
  }://${req.headers.get("host")}`;

  const fontData = await fetch(`${baseUri}/fonts/Pally-Medium.ttf`).then((r) =>
    r.arrayBuffer()
  );

  return new ImageResponse(
    (
      <div tw="flex flex-row w-full  h-full items-center justify-center bg-[#FBCB07]">
        <div tw="flex flex-col items-center">
          <svg
            width={144}
            height={54}
            viewBox="4 9 16 6"
            fill="white"
            fillRule="evenodd"
          >
            <path d="M13,11L13,9L7,9L7,11L4,11L4,14L5,14L5,12L7,12L7,15L13,15L13,12L14,12L14,15L20,15L20,9L14,9L14,11L13,11ZM17,10L17,14L19,14L19,10L17,10ZM10,10L10,14L12,14L12,10L12,10Z" />
          </svg>
          <h2
            tw="text-white font-bold text-6xl ml-6 leading-none"
            style={{
              fontFamily: '"Pally"',
            }}
          >
            Yellow Noundry
          </h2>
        </div>
        <h1 tw="absolute bottom-28 font-semibold text-white">
          For the community. By the community.
        </h1>
      </div>
    ),
    {
      // debug: true,
      fonts: [
        {
          name: "Pally",
          weight: 400,
          data: fontData,
        },
      ],
    }
  );
}
