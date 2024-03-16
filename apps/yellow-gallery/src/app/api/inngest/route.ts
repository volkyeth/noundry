import { inngest } from "@/utils/inngest/client";
import { serve } from "inngest/next";
import { dumpTraits } from "./handlers/db/dump/dumpTraits";
import { dumpUsers } from "./handlers/db/dump/dumpUsers";
import { runScript } from "./handlers/runScript";
import { castOnFarcaster } from "./handlers/trait/submitted/castOnFarcaster";
import { postOnTwitter } from "./handlers/trait/submitted/postOnTwitter";
import { upsertUser } from "./handlers/user/signedIn/upsertUser";
import { updateCordUser } from "./handlers/user/updated/updateCordUser";

export const maxDuration = 300;

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    castOnFarcaster,
    // postOnDiscord,
    postOnTwitter,
    dumpTraits,
    dumpUsers,
    runScript,
    upsertUser,
    updateCordUser,
  ],
});
