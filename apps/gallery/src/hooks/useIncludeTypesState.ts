import { useQueryState } from "next-usequerystate";
import { useEffect } from "react";

export const useIncludeTypesState = () => {
  const includeTypesState = useQueryState<
    ("heads" | "glasses" | "accessories" | "bodies")[] | null
  >("includeTypes", {
    defaultValue: null,
    parse: (v) =>
      v
        .split(",")
        .filter((v) =>
          ["heads", "glasses", "accessories", "bodies"].includes(v)
        ) as ("heads" | "glasses" | "accessories" | "bodies")[],
    serialize: (v) => (v ? (v.length === 4 ? "" : v.join(",")) : ""),
  });

  const [includeTypes, setIncludeTypes] = includeTypesState;

  useEffect(() => {
    if (includeTypes?.length === 4) {
      setIncludeTypes(null, { history: "replace" });
    }
  }, [includeTypes]);

  return includeTypesState;
};
