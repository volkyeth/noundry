import { SortCriteria } from "@/types/sort";
import { useQueryState } from "next-usequerystate";

export const useSortBy = () =>
  useQueryState<SortCriteria>("sortBy", {
    defaultValue: "newest",
    parse: (v) =>
      ["newest", "oldest", "mostLiked"].includes(v)
        ? (v as SortCriteria)
        : "newest",
  });
