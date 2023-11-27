import { EventSchemas, Inngest } from "inngest";

type TraitSubmitted = {
  data: {
    traitId: string;
  };
};

type Events = {
  "trait/submitted": TraitSubmitted;
};

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "noundry-gallery",
  schemas: new EventSchemas().fromRecord<Events>(),
});
