import { inngest } from "@/inngest/client";
import { serve } from "inngest/next";
import { castOnFarcaster } from "./handlers/trait/submitted/castOnFarcaster";
import { postOnDiscord } from "./handlers/trait/submitted/postOnDiscord";
import { postOnTwitter } from "./handlers/trait/submitted/postOnTwitter";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [castOnFarcaster, postOnDiscord, postOnTwitter],
});
