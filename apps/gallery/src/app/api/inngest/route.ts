import { inngest } from "@/utils/inngest/client";
import { serve } from "inngest/next";
import { initCordData } from "./handlers/cord/init/initCordData";
import { dumpTraits } from "./handlers/db/dump/dumpTraits";
import { dumpUsers } from "./handlers/db/dump/dumpUsers";
import { migrateAddUsersEns } from "./handlers/db/migrate/addUsersEns";
import { castOnFarcaster } from "./handlers/trait/submitted/castOnFarcaster";
import { postOnDiscord } from "./handlers/trait/submitted/postOnDiscord";
import { postOnTwitter } from "./handlers/trait/submitted/postOnTwitter";
import { upsertUser } from "./handlers/user/signedIn/upsertUser";
import { updateCordUser } from "./handlers/user/updated/updateCordUser";

export const maxDuration = 300;

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    castOnFarcaster,
    postOnDiscord,
    postOnTwitter,
    dumpTraits,
    dumpUsers,
    migrateAddUsersEns,
    initCordData,
    upsertUser,
    updateCordUser,
  ],
});
