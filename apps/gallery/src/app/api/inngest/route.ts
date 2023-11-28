import { inngest } from "@/inngest/client";
import { serve } from "inngest/next";
import { castOnFarcaster } from "./handlers/trait/submitted/castOnFarcaster";
import { postOnDiscord } from "./handlers/trait/submitted/postOnDiscord";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [castOnFarcaster, postOnDiscord],
});
