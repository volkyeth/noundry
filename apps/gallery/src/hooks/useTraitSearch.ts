import { useQueryState } from "nuqs";

export const useTraitSearch = () =>
  useQueryState<string>("search", {
    defaultValue: "",
    parse: (v) => v.toString(),
  });
