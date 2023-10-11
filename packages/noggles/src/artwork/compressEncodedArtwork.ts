// export const compressEncodedArtwork = (
//   encodedArtwork: EncodedArtwork[]
// ): EncodedCompressedParts => {
//   const abiEncodedArtwork = encodeAbiParameters(
//     [{ type: "bytes[]" }],
//     [encodedArtwork]
//   );
//   const encodedCompressedArtwork = ("0x" +
//     Buffer.from(
//       deflateRaw(Buffer.from(abiEncodedArtwork.substring(2), "hex"))
//     ).toString("hex")) as `0x${string}`;
//   const originalLength = BigInt(abiEncodedArtwork.substring(2).length / 2);
//   const itemCount = encodedArtwork.length;
//   return [encodedCompressedArtwork, originalLength, itemCount];
// };
