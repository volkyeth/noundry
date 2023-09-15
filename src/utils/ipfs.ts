import { NFTStorage } from "nft.storage";

export const getNftStorageClient = () => new NFTStorage({ token: import.meta.env.VITE_NFT_STORAGE_API_KEY });
