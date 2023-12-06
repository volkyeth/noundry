import { EventSchemas, Inngest } from "inngest";

type TraitSubmitted = {
  data: {
    traitId: string;
  };
};

type TraitDeleted = {
  data: {
    traitId: string;
  };
};

type DbMigrate = {
  data: {
    migrationId: string;
  };
};

type DbDump = {
  data: {};
};

type Events = {
  "trait/submitted": TraitSubmitted;
  "trait/deleted": TraitDeleted;
  "db/migrate": DbMigrate;
  "db/dump": DbDump;
};

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "noundry-gallery",
  schemas: new EventSchemas().fromRecord<Events>(),
});
