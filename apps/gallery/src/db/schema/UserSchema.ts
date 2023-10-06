export interface UserSchema {
  _id: `0x${string}`;
  twitter?: string;
  userName?: string;
  headCount: number;
  accessoryCount: number;
  glassesCount: number;
  likesCount: number;
  about: string;
  nfts: string[];
  likedNfts: string[];
  profilePic: string;
}
