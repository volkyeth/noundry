"use client";
import ColorGrid from "@/components/ColorGrid/ColorGrid";
import { RiAlertLine } from "react-icons/ri";

export default function Guidelines() {
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
        <h1>Guidelines</h1>
        <div className="flex flex-col gap-4 text-lg">
          <div className="flex flex-col gap-4">
            <p className="text-xl my-2 ">
              Noundry is a platform for artists to create and share Nouns
              traits. We want to make it easy for artists to contribute to the
              Nouns ecosystem while maintaining the high quality standards that
              make Nouns special.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h2>Technical Requirements</h2>
            <div className="flex flex-col gap-2">
              <p>
                <span className="font-bold">Size:</span> 32x32 pixels
              </p>
              <p>
                <span className="font-bold">Format:</span> PNG with transparency
              </p>
              <p>
                <span className="font-bold">Colors:</span> Use only colors from
                the Nouns palette
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2>Nouns Color Palette</h2>
            <ColorGrid colors={colors} />
          </div>

          <div className="flex flex-col gap-4">
            <h2>Design Guidelines</h2>
            <div className="flex flex-col gap-2">
              <p>
                <span className="font-bold">Style:</span> Follow the Nouns
                aesthetic - simple, bold, and iconic
              </p>
              <p>
                <span className="font-bold">Originality:</span> Create original
                artwork, don&apos;t copy existing traits
              </p>
              <p>
                <span className="font-bold">Clarity:</span> Designs should be
                recognizable at small sizes
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2>Content Guidelines</h2>
            <div className="flex flex-col gap-2">
              <p>
                <span className="font-bold">Family-friendly:</span> Keep it
                appropriate for all ages
              </p>
              <p>
                <span className="font-bold">No hate:</span> No hate speech,
                discrimination, or offensive content
              </p>
              <p>
                <span className="font-bold">No copyrighted material:</span>{" "}
                Don&apos;t use copyrighted or trademarked content
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2>Submission Process</h2>
            <div className="flex flex-col gap-2">
              <p>
                1. Create your trait following the technical and design
                guidelines
              </p>
              <p>2. Upload your trait to Noundry</p>
              <p>
                3. If you want your trait to be part of the official Nouns
                collection:
              </p>
              <ul className="list-disc list-inside pl-4">
                <li>Submit a candidate proposal</li>
                <li>
                  If sponsored and successful, your trait becomes part of the
                  Nouns collection
                </li>
                <li>Your trait becomes CC0 (public domain)</li>
              </ul>
            </div>
          </div>

          <div className="flex items-center gap-2 p-4 bg-warning-50 text-warning-900 rounded-lg">
            <RiAlertLine className="text-2xl flex-shrink-0" />
            <p>
              Remember: Traits that don&apos;t follow these guidelines may be
              removed without notice
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
