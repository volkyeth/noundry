import { getCordServerToken } from "@/app/api/cord/getCordServerToken";
import { TraitSchema } from "@/db/schema/TraitSchema";
import { database } from "@/utils/database/db";
import { inngest } from "@/utils/inngest/client";

export const runScript = inngest.createFunction(
  { id: "run-script" },
  {
    event: "run-script",
  },
  async ({ event, step, logger }) => {
    
  }
);
