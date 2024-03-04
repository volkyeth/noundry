import { useQueryState } from "next-usequerystate";
import { useEffect } from "react";

export const useIncludeTraitTypes = () => {
  const includeTypesState = useQueryState<("heads" | "accessories")[] | null>(
    "includeTypes",
    {
      defaultValue: null,
      parse: (v) =>
        v.split(",").filter((v) => ["heads", "accessories"].includes(v)) as (
          | "heads"
          | "accessories"
        )[],
      serialize: (v) => (v ? (v.length === 4 ? "" : v.join(",")) : ""),
    }
  );

  const [includeTypes, setIncludeTypes] = includeTypesState;

  useEffect(() => {
    if (includeTypes?.length === 4) {
      setIncludeTypes(null, { history: "replace" });
    }
  }, [includeTypes]);

  return includeTypesState;
};
