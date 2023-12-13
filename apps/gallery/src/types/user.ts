export interface UserStats {
  address: `0x${string}`;
  traits: number;
  heads: number;
  accessories: number;
  glasses: number;
  bodies: number;
}

export interface UserInfo {
  address: `0x${string}`;
  twitter?: string;
  farcaster?: string;
  userName: string;
  about?: string;
  profilePic: string;
}
