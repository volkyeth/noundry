/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { Trait } from "@/types/trait";
import { UserInfo } from "@/types/user";
import { resizePng } from "@/utils/image/resize";
import { formatTraitType } from "@/utils/traits/format";
import { appConfig } from "@/variants/config";
import { ImageResponse } from "@vercel/og";
import { NextResponse } from "next/server";
import { TraitCategory } from "noggles";
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
              Nouns
            </h1>
          </div>
          <svg
            width={420}
            height={108}
            xmlns="http://www.w3.org/2000/svg"
            fill-rule="evenodd"
            stroke-linejoin="round"
            stroke-miterlimit="2"
            clip-rule="evenodd"
            viewBox="0 0 700 180"
          >
            <path fill="#fff" d="M9.999 9.999h200.002v160.002H9.999z" />
            <path
              fill="#1f1d29"
              fill-rule="nonzero"
              d="M0 180V0h220v180H0Zm20-20h180V20H20v140Z"
            />
            <path fill="#e3e3e3" d="M30.001 29.999h160v120.002h-160z" />
            <path
              fill="#fff"
              d="M130.001 70h20v40h-20zM60.002 70H80v40H60.002z"
            />
            <path fill="#1f1c1c" d="M150.001 70h20v40h-20zM80 70h20v40H80z" />
            <path
              fill="#ff2165"
              fill-rule="nonzero"
              d="M109.999 80H120V60h60v60h-60V89.999h-9.999v29.999H49.999V89.999H30.001v20H20V80h29.999V60h60v20ZM60 110.001h39.998V69.999H60v40.002Zm70.001 0h40V69.999h-40v40.002Z"
            />
            <path
              fill="#1F1D29"
              fill-rule="nonzero"
              d="M307.876 73.445h-10.622L273.2 37.286v36.159H262.58V20.679H273.2l24.053 36.234V20.679h10.622v52.766ZM354.312 73.973c-4.932 0-9.485-1.132-13.658-3.472s-7.436-5.51-9.864-9.663c-2.428-4.076-3.642-8.68-3.642-13.89 0-5.132 1.214-9.737 3.642-13.889 2.428-4.076 5.691-7.247 9.864-9.587 4.173-2.34 8.726-3.472 13.658-3.472 5.007 0 9.56 1.132 13.733 3.472 4.097 2.34 7.36 5.51 9.788 9.587 2.352 4.152 3.566 8.757 3.566 13.89 0 5.208-1.214 9.813-3.566 13.89-2.428 4.151-5.69 7.322-9.864 9.662-4.173 2.34-8.725 3.472-13.657 3.472Zm0-9.436c3.186 0 5.994-.755 8.422-2.189 2.428-1.434 4.325-3.472 5.69-6.114 1.366-2.642 2.049-5.737 2.049-9.285s-.683-6.643-2.049-9.285c-1.365-2.642-3.262-4.605-5.69-6.04-2.428-1.433-5.236-2.113-8.422-2.113-3.187 0-5.994.68-8.422 2.114-2.504 1.434-4.401 3.397-5.767 6.039-1.366 2.642-2.049 5.737-2.049 9.285s.683 6.643 2.049 9.285c1.366 2.642 3.263 4.68 5.767 6.114 2.428 1.434 5.235 2.19 8.422 2.19ZM411.142 20.755v32.61c0 3.548.91 6.266 2.808 8.153 1.897 1.962 4.476 2.868 7.89 2.868 3.415 0 6.07-.906 7.968-2.868 1.896-1.887 2.807-4.605 2.807-8.153v-32.61h10.698V53.29c0 4.453-.986 8.228-2.883 11.323-1.973 3.095-4.552 5.435-7.815 7.02-3.339 1.585-6.905 2.34-10.926 2.34-3.946 0-7.512-.755-10.698-2.34-3.263-1.585-5.767-3.925-7.664-7.02-1.897-3.095-2.807-6.87-2.807-11.323V20.755h10.622ZM510.235 73.445h-10.622L475.56 37.286v36.159h-10.623V20.679h10.623l24.052 36.234V20.679h10.622v52.766ZM550.6 20.755c5.54 0 10.472 1.057 14.72 3.246 4.174 2.189 7.436 5.208 9.788 9.21 2.277 4 3.415 8.68 3.415 13.964 0 5.284-1.138 9.889-3.415 13.814-2.352 4.001-5.614 7.02-9.787 9.21-4.25 2.189-9.181 3.246-14.72 3.246h-18.514v-52.69h18.514Zm-.379 43.707c5.54 0 9.864-1.51 12.9-4.53 3.034-3.019 4.552-7.246 4.552-12.757 0-5.51-1.518-9.813-4.553-12.908-3.035-3.095-7.36-4.605-12.899-4.605h-7.511v34.8h7.511ZM625.185 73.445l-11.684-20.533h-5.008v20.533H597.87v-52.69h19.88c4.097 0 7.587.68 10.47 2.113 2.884 1.435 5.084 3.397 6.525 5.813 1.442 2.491 2.125 5.209 2.125 8.228 0 3.472-.986 6.567-3.035 9.36-2.049 2.793-5.008 4.756-9.03 5.813l12.672 21.363h-12.292Zm-16.692-28.459h8.877c2.883 0 5.008-.68 6.45-2.114 1.441-1.358 2.124-3.245 2.124-5.737 0-2.415-.683-4.302-2.124-5.661-1.442-1.283-3.567-1.963-6.45-1.963h-8.877v15.475ZM699.998 20.755 682.092 55.1v18.344h-10.623V55.1l-17.982-34.346h11.988l11.381 24.08 11.306-24.08h11.836ZM299.454 122.71c-1.214-2.19-2.883-3.925-5.008-5.058-2.124-1.132-4.628-1.736-7.435-1.736-3.111 0-5.919.68-8.347 2.114-2.428 1.434-4.325 3.397-5.69 6.039-1.366 2.642-2.049 5.661-2.049 9.058 0 3.548.683 6.567 2.125 9.21 1.365 2.641 3.262 4.604 5.766 6.038 2.504 1.435 5.387 2.114 8.65 2.114 4.021 0 7.36-1.057 9.94-3.246 2.58-2.114 4.248-5.058 5.083-8.907h-18.21v-8.077h28.68v9.209c-.682 3.699-2.2 7.096-4.552 10.19-2.352 3.096-5.31 5.587-8.953 7.474-3.718 1.887-7.815 2.868-12.368 2.868-5.083 0-9.712-1.132-13.809-3.472-4.173-2.265-7.36-5.435-9.712-9.511-2.352-4.077-3.566-8.681-3.566-13.89 0-5.209 1.214-9.813 3.566-13.965 2.352-4.076 5.54-7.247 9.712-9.587 4.097-2.264 8.65-3.397 13.734-3.397 5.994 0 11.153 1.434 15.554 4.303 4.4 2.944 7.436 7.02 9.105 12.229h-12.216ZM374.002 149.508h-21.093l-3.49 10.04h-11.154l19.044-52.766h12.368l19.045 52.765h-11.23l-3.49-10.04Zm-2.883-8.455-7.664-22.042-7.663 22.042h15.327ZM427.151 151.168h17.452v8.38h-28.074v-52.69h10.622v44.31ZM482.654 151.168h17.452v8.38h-28.074v-52.69h10.622v44.31ZM538.157 115.388v13.21h17.831v8.379h-17.83v13.965h20.106v8.605h-30.73v-52.765h30.73v8.606h-20.107ZM615.891 159.547l-11.685-20.532H599.2v20.532h-10.623v-52.69h19.88c4.097 0 7.587.68 10.47 2.114 2.883 1.434 5.084 3.397 6.525 5.813 1.442 2.49 2.125 5.208 2.125 8.228 0 3.472-.987 6.567-3.035 9.36-2.049 2.793-5.008 4.756-9.03 5.813l12.672 21.362H615.89Zm-16.692-28.458h8.877c2.883 0 5.008-.68 6.45-2.114 1.44-1.359 2.124-3.246 2.124-5.737 0-2.415-.683-4.302-2.125-5.661-1.441-1.284-3.566-1.963-6.45-1.963H599.2v15.475ZM699.998 106.858l-17.906 34.346v18.343h-10.623v-18.343l-17.982-34.346h11.988l11.381 24.08 11.306-24.08h11.836Z"
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
    },
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
