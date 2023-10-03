export const shortAddress = (address: `0x${string}`) =>
  address.slice(0, 6) + "..." + address.slice(-4);
