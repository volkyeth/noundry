"use client";
import Image from "next/image";
import { RiAlertLine } from "react-icons/ri";
import ColorGrid from "../components/ColorGrid/ColorGrid";

const GuideLines = () => {
  const colors = [
    "ffffff",
    "c5b9a1",
    "cfc2ab",
    "63a0f9",
    "807f7e",
    "caeff9",
    "5648ed",
    "5a423f",
    "b9185c",
    "b87b11",
    "fffdf2",
    "4b4949",
    "343235",
    "1f1d29",
    "068940",
    "867c1d",
    "ae3208",
    "9f21a0",
    "f98f30",
    "fe500c",
    "d26451",
    "fd8b5b",
    "5a65fa",
    "d22209",
    "e9265c",
    "c54e38",
    "80a72d",
    "4bea69",
    "34ac80",
    "eed811",
    "62616d",
    "ff638d",
    "8bc0c5",
    "c4da53",
    "000000",
    "f3322c",
    "ffae1a",
    "ffc110",
    "505a5c",
    "ffef16",
    "fff671",
    "fff449",
    "db8323",
    "df2c39",
    "f938d8",
    "5c25fb",
    "2a86fd",
    "45faff",
    "38dd56",
    "ff3a0e",
    "d32a09",
    "903707",
    "6e3206",
    "552e05",
    "e8705b",
    "f38b7c",
    "e4a499",
    "667af9",
    "648df9",
    "7cc4f2",
    "97f2fb",
    "a3efd0",
    "87e4d9",
    "71bde4",
    "ff1a0b",
    "f78a18",
    "2b83f6",
    "d62149",
    "834398",
    "ffc925",
    "d9391f",
    "bd2d24",
    "ff7216",
    "254efb",
    "e5e5de",
    "00a556",
    "c5030e",
    "abf131",
    "fb4694",
    "e7a32c",
    "fff0ee",
    "009c59",
    "0385eb",
    "00499c",
    "e11833",
    "26b1f3",
    "fff0be",
    "d8dadf",
    "d7d3cd",
    "1929f4",
    "eab118",
    "0b5027",
    "f9f5cb",
    "cfc9b8",
    "feb9d5",
    "f8d689",
    "5d6061",
    "76858b",
    "757576",
    "ff0e0e",
    "0adc4d",
    "fdf8ff",
    "70e890",
    "f7913d",
    "ff1ad2",
    "ff82ad",
    "535a15",
    "fa6fe2",
    "ffe939",
    "ab36be",
    "adc8cc",
    "604666",
    "f20422",
    "abaaa8",
    "4b65f7",
    "a19c9a",
    "58565c",
    "da42cb",
    "027c92",
    "cec189",
    "909b0e",
    "74580d",
    "027ee6",
    "b2958d",
    "efad81",
    "7d635e",
    "eff2fa",
    "6f597a",
    "d4b7b2",
    "d18687",
    "cd916d",
    "6b3f39",
    "4d271b",
    "85634f",
    "f9f4e6",
    "f8ddb0",
    "b92b3c",
    "d08b11",
    "257ced",
    "a3baed",
    "5fd4fb",
    "c16710",
    "a28ef4",
    "3a085b",
    "67b1e3",
    "1e3445",
    "ffd067",
    "962236",
    "769ca9",
    "5a6b7b",
    "7e5243",
    "a86f60",
    "8f785e",
    "cc0595",
    "42ffb0",
    "d56333",
    "b8ced2",
    "b91b43",
    "f39713",
    "e8e8e2",
    "ec5b43",
    "235476",
    "b2a8a5",
    "d6c3be",
    "49b38b",
    "fccf25",
    "f59b34",
    "375dfc",
    "99e6de",
    "27a463",
    "554543",
    "b19e00",
    "d4a015",
    "9f4b27",
    "f9e8dd",
    "6b7212",
    "9d8e6e",
    "4243f8",
    "fa5e20",
    "f82905",
    "555353",
    "876f69",
    "410d66",
    "552d1d",
    "f71248",
    "fee3f3",
    "c16923",
    "2b2834",
    "0079fc",
    "d31e14",
    "f83001",
    "8dd122",
    "fffdf4",
    "ffa21e",
    "e4afa3",
    "fbc311",
    "aa940c",
    "eedc00",
    "fff006",
    "9cb4b8",
    "a38654",
    "ae6c0a",
    "2bb26b",
    "e2c8c0",
    "f89865",
    "f86100",
    "dcd8d3",
    "049d43",
    "d0aea9",
    "f39d44",
    "eeb78c",
    "f9f5e9",
    "5d3500",
    "c3a199",
    "aaa6a4",
    "caa26a",
    "fde7f5",
    "fdf008",
    "fdcef2",
    "f681e6",
    "018146",
    "d19a54",
    "9eb5e1",
    "f5fcff",
    "3f9323",
    "00fcff",
    "4a5358",
    "fbc800",
    "d596a6",
    "ffb913",
    "e9ba12",
    "767c0e",
    "f9f6d1",
    "d29607",
    "f8ce47",
    "395ed1",
    "ffc5f0",
    "cbc1bc",
    "d4cfc0",
  ];
  return (
    <>
      <div className="container w-full max-w-4xl mx-auto px-4 gap-8 flex flex-col py-4 pt-8">
        <div className="flex w-full justify-between items-center"></div>
        <div className="flex flex-col gap-4 text-lg my-5">
          <div className="flex flex-col gap-2">
            <div className="list-disc flex flex-col gap-2 pl-8">
              <h1>Guidelines</h1>

              <li className=" my-1">
                Traits should be submitted as partially transparent PNGs. Ensure
                only the artwork is visible, as it will be automatically
                combined with the original Nouns traits.
              </li>

              <Image
                className="px-2 py-2"
                src="/noundry-guidelines-example.png"
                alt="example"
                width={500}
                height={250}
                unoptimized
              />

              <li className=" my-1">
                Nouns are typically depicted 'head-on' or with a slight rotation
                to the right to match their 3/4 pose.
              </li>

              <li className=" my-1">
                <RiAlertLine className=" text-3xl inline-flex -translate-y-1" />{" "}
                {
                  "Traits are layered in that order: Body -> Accessory -> Head -> Glasses."
                }
                <br></br>
                <Image
                  className="py-2"
                  src="/drawing-order-guidelines.png"
                  alt="drawing order"
                  width={640}
                  height={418}
                  unoptimized
                />
                <p className=" text-sm ">
                  Accessory traits will be layered over the Body, Head traits
                  will be layered over both Accessory and Body, and Glasses will
                  be layered over everything.
                  <br></br>Ensure there is sufficient space below the Head for
                  accessories.
                  <br></br>We recommend submitting monochrome Body traits to
                  avoid clashes with accessories. If you wish to create a
                  detailed Body trait, consider making it an accessory as it
                  will cover the body underneath.
                </p>
              </li>

              <li className="my-1">
                Avoid too many colors. The average noun has 4-5 colors, rarely
                more than 10.{" "}
              </li>
              <div className="flex flex-wrap md:flex-row sm:flex-row dsm:flex-col">
                <Image
                  className="px-2 py-2"
                  src="/ghostExample.png"
                  alt="Ghost"
                  width={250}
                  height={250}
                  unoptimized
                />
                <Image
                  className="px-2 py-2"
                  src="/pyramidExample.png"
                  alt="Pyramid"
                  width={250}
                  height={250}
                  unoptimized
                />
                <Image
                  className="px-2 py-2"
                  src="/sandwichExample.png"
                  alt="Sandwich"
                  width={250}
                  height={250}
                  unoptimized
                />
              </div>

              <li className=" my-1">
                Generally designed flat with high contrasts and no outlines.{" "}
              </li>

              <li className=" my-1">
                Maintain the head size within a circular crop for social media.
              </li>

              <Image
                className="px-2 py-2"
                src="/headcrop-guidelines-640.png"
                alt="head crop"
                width={250}
                height={250}
                unoptimized
              />

              <div className="bg-bright-light dark:bg-off-dark p-3 m-3">
                <p className="lead m-4 text-sm ">
                  <a
                    href="https://discord.com/channels/849745721544146955/931247256470953994/932159019592871987"
                    target="_blank"
                    className=" underline hover:text-primary "
                  >
                    {" "}
                    From the nounders in last year noundry channel,
                  </a>{" "}
                  avoid:
                </p>
                <ul className="list-disc flex flex-col gap-1 pl-8 italic mb-2 text-sm ">
                  <p>- Brand references</p>
                  <p>
                    - Obvious weapons (bomb made the cut because it's cartoon
                    violence)
                  </p>
                  <p>
                    - Skin on the body (yellow thumbs up made it in as it's
                    generic recognizable iconography)
                  </p>
                  <p>
                    - People heads where it would seem like the noun is a person
                    in a costume (there was a clown for example)
                  </p>
                  <p>
                    - Professions/hobbies as body accessories - we didn't want
                    to imply nouns have jobs or are specifically sports fans,
                    etc
                  </p>
                </ul>
              </div>

              <h1>Tools</h1>
              <a href="https://studio.noundry.wtf/" target="_blank">
                <Image
                  className="px-12 py-6"
                  src="/noundry.jpg"
                  alt="noundry studio"
                  width={600}
                  height={250}
                />
              </a>
              <li className=" my-3">
                We recommend using{" "}
                <a
                  href="https://studio.noundry.wtf/"
                  target="_blank"
                  className=" underline hover:text-primary"
                >
                  Noundry Studio
                </a>{" "}
                to create and remix traits while making sure you stay compatible
                with the current Nouns palette.{" "}
              </li>
              <li className=" my-3">
                You can copy nounish color values by clicking the palette below.{" "}
              </li>

              <div className="px-12 py-2">
                <ColorGrid colors={colors} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 my-3">
            <div className="list-disc flex flex-col gap-2 pl-8">
              <h1>Social</h1>
              <a
                href="https://discord.com/channels/849745721544146955/931247256470953994/931248704512458823"
                target="_blank"
                className=" underline hover:text-primary  text-md"
              >
                Original Nouns Discord
              </a>
              <a
                href="https://discord.com/channels/1113645847872278603/1113646233614037022/1113914207776280636"
                target="_blank"
                className=" underline hover:text-primary text-lg"
              >
                Nouniversary Discord
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuideLines;
