import { LowercaseAddress } from "./address";

export interface UserStats {
  address: LowercaseAddress;
  traits: number;
  heads: number;
  accessories: number;
  glasses: number;
  bodies: number;
}

export interface UserInfo {
  address: LowercaseAddress;
  twitter?: string;
  farcaster?: string;
  userName: string;
  about?: string;
  profilePic: string;
}
