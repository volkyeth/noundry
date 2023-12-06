import { inngest } from "@/inngest/client";
import { serve } from "inngest/next";
import { dumpTraits } from "./handlers/db/dump/dumpTraits";
import { dumpUsers } from "./handlers/db/dump/dumpUsers";
import { migrateLikedByToLowercase } from "./handlers/db/migrate/likedByToLowerCase";
import { castOnFarcaster } from "./handlers/trait/submitted/castOnFarcaster";
import { postOnDiscord } from "./handlers/trait/submitted/postOnDiscord";
import { postOnTwitter } from "./handlers/trait/submitted/postOnTwitter";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    castOnFarcaster,
    postOnDiscord,
    postOnTwitter,
    migrateLikedByToLowercase,
    dumpTraits,
    dumpUsers,
  ],
});
