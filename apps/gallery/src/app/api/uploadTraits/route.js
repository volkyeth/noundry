import { database } from "@/app/database/db";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const formData = await req.formData();
  const nft = formData.get("nft");
  let name = formData.get("name");
  let type = formData.get("type");
  let twitter = formData.get("twitter");
  let userAddress = formData.get("userAddress");

  let trait = formData.get("trait");
  let background = formData.get("background");
  let body = formData.get("body");
  let head = formData.get("head");
  let accessory = formData.get("accessory");
  let glasses = formData.get("glasses");
  try {
    name = formatName(name);
    const dbObj = {
      nft: nft,
      name: name,
      type: type,
      trait: trait,
      twitter: twitter,
      address: userAddress,
      background: background,
      body: body,
      head: formatName(head),
      accessory: formatName(accessory),
      glasses: glasses,
      likesCount: 0,
      likedBy: [],
      creationDate: new Date().getTime(),
      creator: "",
    };

    const userRecord = await database
      .collection("users")
      .find({ _id: userAddress })
      .toArray();
    if (userRecord.length == 0) {
      const userObj = {
        _id: userAddress,
        twitter: twitter,
        headCount: type == "heads" ? 1 : 0,
        accessoryCount: type == "accessories" ? 1 : 0,
        glassesCount: type == "glasses" ? 1 : 0,
        likesCount: 0,
        about: "",
      };
      const ress = await database.collection("users").insertOne(userObj);
    } else {
      const userObj = userRecord[0];
      if (userObj.userName != "") {
        dbObj.creator = userObj.userName;
      }
      if (type == "heads") {
        userObj.headCount = userObj.headCount + 1;
        await database
          .collection("users")
          .replaceOne({ _id: userAddress }, userObj);
      } else if (type == "accessories") {
        userObj.accessoryCount = userObj.accessoryCount + 1;
        await database
          .collection("users")
          .replaceOne({ _id: userAddress }, userObj);
      } else if (type == "glasses") {
        userObj.glassesCount = userObj.glassesCount + 1;
        await database
          .collection("users")
          .replaceOne({ _id: userAddress }, userObj);
      }
    }
    const traitObj = {
      name: name,
      file: trait,
      type: type,
      userAddress: userAddress,
      twitter: twitter,
    };
    await database.collection("userTraits").insertOne(traitObj);
    const res = await database.collection("nfts").insertOne(dbObj);
    return NextResponse.json({
      status: "done",
    });
  } catch (error) {
    return NextResponse.json({ status: "failed", reason: error });
  }
}

function formatName(string) {
  return (
    string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
  ).replaceAll(" ", "-");
}
