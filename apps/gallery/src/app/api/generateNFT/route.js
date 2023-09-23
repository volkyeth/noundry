import { database } from "@/app/database/db";
import { createCanvas, loadImage } from "canvas";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const formData = await req.formData();
  const trait = formData.get("trait");
  let name = formData.get("name");
  let type = formData.get("type");

  let backgroundName = formData.get("background");
  let bodyName = formData.get("body");
  let headName = formData.get("head");
  let accessoryName = formData.get("accessory");
  let glassesName = formData.get("glasses");

  name = formatName(type, name);
  if (trait) {
  }
  const [backgrounds, bodies, accessories, heads, glasses] = await Promise.all([
    database.collection("backgrounds").find({}).toArray(),
    database.collection("bodies").find({}).toArray(),
    database.collection("accessories").find({}).toArray(),
    database.collection("heads").find({}).toArray(),
    database.collection("glasses").find({}).toArray(),
  ]);

  try {
    let base64Trait;
    if (trait.type == "image/png") {
      base64Trait =
        "data:image/png;base64," +
        Buffer.from(await trait.arrayBuffer()).toString("base64");
    } else {
      base64Trait = trait;
    }
    let background = await getLayer("backgrounds", backgroundName, backgrounds);
    let body = await getLayer("bodies", bodyName, bodies);
    let head = await getLayer("heads", headName, heads);
    let accessory = await getLayer("accessories", accessoryName, accessories);
    let glass = await getLayer("glasses", glassesName, glasses);
    const layers = [
      background,
      body,
      type == "accessories"
        ? { image: await loadImage(base64Trait), name: name }
        : accessory,
      type == "heads"
        ? { image: await loadImage(base64Trait), name: name }
        : head,
      type == "glasses"
        ? { image: await loadImage(base64Trait), name: name }
        : glass,
    ];

    const canvas = createCanvas(32, 32);
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    for (let layer of layers) {
      ctx.drawImage(layer.image, 0, 0, canvas.width, canvas.height);
    }

    return NextResponse.json({
      image: canvas.toDataURL(),
      trait: base64Trait,
      background: background.name,
      body: body.name,
      head: type == "heads" ? name : head.name,
      accessory: type == "accessories" ? name : accessory.name,
      glasses: type == "glasses" ? name : glass.name,
    });
  } catch (error) {
    return NextResponse.json({ status: "failed", reason: error });
  }
}

function formatName(type, name) {
  return name.replaceAll(" ", "-");
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
