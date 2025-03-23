"use client";
import FarcasterIcon from "@/assets/icons/farcaster.svg";
import Image from "next/image";
import { FaTwitter } from "react-icons/fa6";

export const About = () => {
  return (
    <>
      <div className="container w-full max-w-4xl mx-auto px-4 gap-8 flex flex-col py-4 pt-8">
        <div className="flex flex-col gap-4 text-lg">
          <div className="flex flex-col gap-4">
            <p className="text-xl my-2 ">
              Publish your Lil Nounish artwork, inspire others and have fun! And
              when you&apos;re ready, you can submit your artwork to the DAO!{" "}
            </p>
          </div>
          <div>
            <p className="mb-2 text-md">
              {" "}
              This project was funded by Lil Nouns via{" "}
              <a
                href="https://lilnouns.wtf/vote/285"
                className=" hover:!text-primary underline"
                target="_blank"
              >
                proposal #285
              </a>
              {""}.
            </p>
            <p className="mb-2 text-md">
              {" "}
              And was based off the original Noundry Gallery, funded by Nouns
              via{" "}
              <a
                href="https://nouns.wtf/vote/375"
                className=" hover:!text-primary underline"
                target="_blank"
              >
                proposal #375
              </a>
              {""}.
            </p>
          </div>

          <div className="text-center flex flex-col items-center">
            <p className="mb-4 text-sm mt-10">Built by</p>
            <Image
              src="/volkyPFP.png"
              alt="volky"
              width={200}
              height={200}
              unoptimized
            />
            <div className="inline-flex">
              <p className="mx-2">Volky</p>
              <div className="px-2 pt-1">
                <a href="https://twitter.com/volkyeth" target="_blank">
                  <FaTwitter />
                </a>
              </div>
              <div className="px-2 pt-1">
                <a href="https://warpcast.com/volky" target="_blank">
                  <FarcasterIcon />
                </a>
              </div>
            </div>
            <p className="mt-4 text-sm">
              Get in touch if you have feedback or features requests.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
