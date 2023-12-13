import { ERC55Address } from "@/types/address";
import { ImageUri, PngDataUri } from "@/types/image";

export interface UserSchema {
  _id: ERC55Address;
  twitter?: string;
  farcaster?: string;
  userName?: string;
  about?: string;
  profilePic?: PngDataUri;
  ensAvatar?: ImageUri;
  ensName?: string;
}
