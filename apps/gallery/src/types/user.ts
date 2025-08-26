import { LowercaseAddress } from "./address";

export interface UserStats {
  address: LowercaseAddress;
  traits: number;
  heads: number;
  accessories: number;
  glasses: number;
  bodies: number;
  nouns: number;
  userInfo?: UserInfo;
}

export interface UserInfo {
  address: LowercaseAddress;
  twitter?: string;
  farcaster?: string;
  userName: string;
  nameOrPseudonym?: string;
  about?: string;
  profilePic: string;
}
