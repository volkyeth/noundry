
import { inngest } from "@/utils/inngest/client";

export const runScript = inngest.createFunction(
  { id: "run-script" },
  {
    event: "run-script",
  },
  async ({ event, step, logger }) => {

  }
);
