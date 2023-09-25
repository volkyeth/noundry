import { database } from "@/utils/database/db";
import { createCanvas, loadImage } from "canvas";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const formData = await req.formData();
  const trait = formData.get("trait");
  let type = formData.get("type");

  let backgroundName = formData.get("background");
  let bodyName = formData.get("body");
  let headName = formData.get("head");
  let accessoryName = formData.get("accessory");
  let glassesName = formData.get("glasses");

  const [backgrounds, bodies, accessories, heads, glasses] = await Promise.all([
    database.collection("backgrounds").find({}).toArray(),
    database.collection("bodies").find({}).toArray(),
    database.collection("accessories").find({}).toArray(),
    database.collection("heads").find({}).toArray(),
    database.collection("glasses").find({}).toArray(),
  ]);
  const userTraits = await database.collection("userTraits").find({}).toArray();
  try {
    let nfts = [];
    for (var i = 0; i < 16; i++) {
      let background = await getLayer(
        "backgrounds",
        backgroundName,
        backgrounds
      );
      let body = await getLayer("bodies", bodyName, bodies);
      let head = await getLayer(
        "heads",
        type == "heads" ? trait : headName,
        type == "heads" ? userTraits : heads
      );
      let accessory = await getLayer(
        "accessories",
        type == "accessories" ? trait : accessoryName,
        type == "accessories" ? userTraits : accessories
      );
      let glass = await getLayer(
        "glasses",
        type == "glasses" ? trait : glassesName,
        type == "glasses" ? userTraits : glasses
      );

      const layers = [background, body, accessory, head, glass];

      const canvas = createCanvas(32, 32);
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      for (let layer of layers) {
        ctx.drawImage(layer.image, 0, 0, canvas.width, canvas.height);
      }
      nfts.push(canvas.toDataURL());
    }

    return NextResponse.json({
      images: nfts,
    });
  } catch (error) {
    return NextResponse.json({ status: "failed", reason: error });
  }
}

function formatName(type, name) {
  return type + "-" + name.replaceAll(" ", "-");
}

async function getLayer(type, name, array) {
  try {
    let layer, layerName;
    if (name == "random") {
      const obj = array[Math.floor(Math.random() * array.length)];
      layer = obj.file;
      layerName = obj.name;
    } else {
      for (let i = 0; i < array.length; i++) {
        if (array[i].name == name) {
          layer = array[i].file;
          layerName = array[i].name;
        }
      }
    }
    return {
      image: await loadImage(layer),
      name: layerName,
    };
  } catch (error) {
    throw Error("Layer Not Found");
  }
}
