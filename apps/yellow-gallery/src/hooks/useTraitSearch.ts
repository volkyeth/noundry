import { useQueryState } from "next-usequerystate";

export const useTraitSearch = () =>
  useQueryState<string>("search", {
    defaultValue: "",
    parse: (v) => v.toString(),
  });
