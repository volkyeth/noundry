import { useQueryState } from "nuqs";
import { useEffect } from "react";

export const useIncludeTraitTypes = () => {
  const includeTypesState = useQueryState<
    ("heads" | "glasses" | "accessories" | "bodies" | "nouns")[] | null
  >("includeTypes", {
    defaultValue: null,
    parse: (v) =>
      v
        .split(",")
        .filter((v) =>
          ["heads", "glasses", "accessories", "bodies", "nouns"].includes(v)
        ) as ("heads" | "glasses" | "accessories" | "bodies" | "nouns")[],
    serialize: (v) => (v ? (v.length === 5 ? "" : v.join(",")) : ""),
  });

  const [includeTypes, setIncludeTypes] = includeTypesState;

  useEffect(() => {
    if (includeTypes?.length === 5) {
      setIncludeTypes(null, { history: "replace" });
    }
  }, [includeTypes, setIncludeTypes]);

  return includeTypesState;
};
