import { database } from "@/utils/database/db";
import { NextResponse } from "next/server";
export async function POST(req, res) {
  const formData = await req.formData();
  const file = formData.get("file");
  const name = formData.get("name");
  const twitter = formData.get("twitter");
  const about = formData.get("about");
  const userAddress = formData.get("userAddress");
  const user = await database.collection("users").findOne({ _id: userAddress });

  if (file != null && file != "null") {
    let base64ProfilePic =
      "data:image/png;base64," +
      Buffer.from(await file.arrayBuffer()).toString("base64");
    if (user) {
      await database.collection("users").updateOne(
        { _id: userAddress },
        {
          $set: {
            profilePic: base64ProfilePic,
            userName: name ? name : "",
            twitter: twitter ? twitter : "",
            about: about ? about : "",
          },
        }
      );
    }
  } else {
    await database.collection("users").updateOne(
      { _id: userAddress },
      {
        $set: {
          userName: name ? name : "",
          twitter: twitter ? twitter : "",
          about: about ? about : "",
        },
      }
    );
  }
  return NextResponse.json([file, name, twitter, about, userAddress]);
}
