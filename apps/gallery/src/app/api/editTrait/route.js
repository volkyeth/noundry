import { database } from "@/app/database/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const formData = await req.formData();
  const id = formData.get("id");
  const nft = formData.get("nft");
  let name = formData.get("name");
  let type = formData.get("type");
  let oldType = formData.get("oldType");

  let twitter = formData.get("twitter");
  let userAddress = formData.get("userAddress");

  let traitId = formData.get("traitId");
  let trait = formData.get("trait");
  let background = formData.get("background");
  let body = formData.get("body");
  let head = formData.get("head");
  let accessory = formData.get("accessory");
  let glasses = formData.get("glasses");

  try {
    name = formatName(name);

    const userRecord = await database
      .collection("users")
      .find({ _id: userAddress })
      .toArray();
    const userObj = userRecord[0];

    if (type != oldType && type == "heads") {
      userObj.headCount = userObj.headCount + 1;
      userObj.accessoryCount = userObj.accessoryCount - 1;
      await database.collection("users").updateOne(
        { _id: userAddress },
        {
          $set: {
            headCount: userObj.headCount,
            accessoryCount: userObj.accessoryCount,
          },
        }
      );
    } else if (type != oldType && type == "accessories") {
      userObj.accessoryCount = userObj.accessoryCount + 1;
      userObj.headCount = userObj.headCount - 1;
      await database.collection("users").updateOne(
        { _id: userAddress },
        {
          $set: {
            headCount: userObj.headCount,
            accessoryCount: userObj.accessoryCount,
          },
        }
      );
    }

    const traitObj = {
      name: name,
      file: trait,
      type: type,
      userAddress: userAddress,
      twitter: twitter,
    };

    const res2 = await database
      .collection("userTraits")
      .updateOne(
        { _id: new ObjectId(traitId) },
        { $set: { name: name, file: trait } }
      );

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
    };
    if (userObj.userName != "") {
      dbObj.creator = userObj.userName;
    }
    const res = await database
      .collection("nfts")
      .updateOne({ _id: new ObjectId(id) }, { $set: dbObj });
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
