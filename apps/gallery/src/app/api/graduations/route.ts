import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    // Amiyoko
    // https://www.nouns.camp/proposals/533 Tuba head
    // https://www.nouns.camp/proposals/587 Shrimp Tempura Head
    "0x2d71bab150528fc4d8549b5a2f3e860d75d17296": 2,
    // Facu Serif
    // https://www.nouns.camp/proposals/556 Sand Castle Head
    "0x82d1f493feb2639318045f2c5ddd4b1d0653aa29": 1,
    // Tummlin
    // https://www.nouns.camp/proposals/648 Snake Head
    "0x02604c536327f5a851f87dbfb0888019476481df": 1,
    // Gami
    // https://www.nouns.camp/proposals/714 Gnars Accessory
    "0x387a161c6b25aa854100abaed39274e51aaffffd": 1,
    // FattyButHappy
    // https://www.nouns.camp/proposals/733 Lavender Noggles
    "0xedc1a397589a0236c4810883b7d559288a5fe7e1": 1,
    // MindToasted
    // https://www.nouns.camp/proposals/787 Sock Head
    "0xaad01c20da2d0b331356726a0acb492b30af5cbb": 1,
    // 8rr
    // https://www.nouns.camp/proposals/803 Paper Bag Head
    "0x614ab6edb88fec7e6cd5e9ba83ffc6d5a88d975f": 1,
  });
}
