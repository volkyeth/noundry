"use client";

import { TraitIcon } from "@/components/TraitIcon";
import Link from "next/link";

import { IMAGE_TRAIT_TYPES } from "noggles";

const Submit = () => {
  return (
    <div className="container w-full max-w-4xl mx-auto px-4 gap-20 lg:gap-32 items-center flex flex-col py-4 pt-8">
      <h1 className="font-Pix text-lg xl:text-4xl sm:text-lg lg:text-2xl">
        Submit
      </h1>

      <div className="grid w-full max-w-2xl grid-cols-2 items-center justify-center gap-2 xs:gap-4 sm:gap-6 md:gap-8 text-black">
        {[...IMAGE_TRAIT_TYPES].map((traitType) => (
          <Link key={traitType} href={`/submit/${traitType}`}>
            <button className="w-full flex flex-col gap-2 bg-content1 items-center justify-between p-4 hover:text-primary">
              <TraitIcon
                type={traitType}
                className="w-12 h-12 md:w-[72px] md:h-[72px]"
              />
              <p className="uppercase text-sm font-semibold ">{traitType}</p>
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Submit;
