import { LowercaseAddress } from "@/types/address";
import { ImageUri, PngDataUri } from "@/types/image";

export interface UserSchema {
  _id: LowercaseAddress;
  twitter?: string;
  farcaster?: string;
  userName?: string;
  about?: string;
  profilePic?: PngDataUri;
  ensAvatar?: ImageUri;
  ensName?: string;
}
