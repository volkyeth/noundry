import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");

    if (!address) {
      // Return a meaningful error response if address is missing
      return NextResponse.error({ msg: "Address is missing", status: 404 });
    }

    const payload = {
      address: address,
    };

    // Your secret key (keep this secret)
    const secretKey = "NoundryProject";

    // Generate the JWT
    const token = jwt.sign(payload, secretKey, {
      expiresIn: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
    });

    return NextResponse.json({ status: 200, token: token });
  } catch (error) {
    console.error("Error generating JWT:", error);
    return NextResponse.error("Internal Server Error", { status: 500 });
  }
}
