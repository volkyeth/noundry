export interface Transaction {
  target: `0x${string}`;
  calldata: `0x${string}`;
  value: bigint;
  signature: string;
}
