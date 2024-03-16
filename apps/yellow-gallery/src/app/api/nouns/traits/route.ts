import fs from "fs";
import { NextResponse } from "next/server";
const PNG = require("pngjs").PNG;

export async function GET() {
  const folderToDataUris = (path: string) =>
    fs
      .readdirSync(path)
      .filter((file) => file !== ".DS_Store")
      .map(
        (file) =>
          `data:image/png;base64,${fs
            .readFileSync(`${path}/${file}`)
            .toString("base64")}`
      );

  const artwork = {
    backgrounds: ["#DCE5FD", "#FCEFBC"],
    bodies: folderToDataUris("./src/app/api/nouns/traits/artwork/1-bodies"),
    accessories: folderToDataUris(
      "./src/app/api/nouns/traits/artwork/2-accessories"
    ),
    heads: folderToDataUris("./src/app/api/nouns/traits/artwork/3-heads"),
    glasses: folderToDataUris("./src/app/api/nouns/traits/artwork/4-glasses"),
  };
  // TODO cache for 15min
  return NextResponse.json(artwork);
}
