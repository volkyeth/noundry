import { getServerAuthToken } from "@cord-sdk/server";

export const getCordServerToken = async () => {
  if (
    !process.env.CORD_APPLICATION_ID ||
    !process.env.CORD_APPLICATION_SECRET
  ) {
    throw new Error("Missing CORD_APPLICATION_ID or CORD_APPLICATION_SECRET");
  }

  return getServerAuthToken(
    process.env.CORD_APPLICATION_ID,
    process.env.CORD_APPLICATION_SECRET
  );
};
