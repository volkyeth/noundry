if (!process.env.SIWE_SESSION_SECRET) {
  throw new Error("SIWE_SESSION_SECRET cannot be empty.");
}

export const SIWE_COOKIE_NAME = "siwe-session";
export const SIWE_SESSION_SECRET = process.env.SIWE_SESSION_SECRET;
export const SIWE_TTL = 60 * 60 * 24 * 30; // 30 days
