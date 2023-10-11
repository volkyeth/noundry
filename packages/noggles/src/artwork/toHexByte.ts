export const toHexByte = (n: number): string => {
  return n.toString(16).padStart(2, "0");
};
