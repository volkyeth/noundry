import { PngDataUri } from "@/types/image";

export interface UserSchema {
  _id: `0x${string}`;
  twitter?: string;
  farcaster?: string;
  userName?: string;
  headCount: number;
  accessoryCount: number;
  glassesCount: number;
  likesCount: number;
  about: string;
  nfts: string[];
  likedNfts: string[];
  profilePic: PngDataUri;
}
