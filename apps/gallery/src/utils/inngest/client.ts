import { LowercaseAddress } from "@/types/address";
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

type CordInit = {
  data: {};
};

type UserSignedIn = {
  data: {
    address: LowercaseAddress;
  };
};

type UserUpdated = {
  data: {
    address: LowercaseAddress;
  };
};

type Events = {
  "trait/submitted": TraitSubmitted;
  "trait/deleted": TraitDeleted;
  "db/migrate": DbMigrate;
  "db/dump": DbDump;
  "cord/init": CordInit;
  "user/signed-in": UserSignedIn;
  "user/updated": UserUpdated;
};

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "noundry-gallery",
  schemas: new EventSchemas().fromRecord<Events>(),
  baseUrl: process.env.INNGEST_URL,
});
