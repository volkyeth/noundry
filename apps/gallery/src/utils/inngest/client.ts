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

type RunScript = {
  data: {};
};

type DbDump = {
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
  "run-script": RunScript;
  "db/dump": DbDump;
  "user/signed-in": UserSignedIn;
  "user/updated": UserUpdated;
};

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "noundry-gallery",
  schemas: new EventSchemas().fromRecord<Events>(),
});
