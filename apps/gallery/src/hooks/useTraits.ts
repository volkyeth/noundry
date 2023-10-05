"use client";

import { TraitsQuery, toQuerySting } from "@/queries/traitsQuery";
import { Trait } from "@/types/trait";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSIWE } from "connectkit";

export const useTraits = (query: Partial<TraitsQuery>) => {
  const { data: siweCredentials } = useSIWE();
  return useInfiniteQuery({
    queryKey: ["traits", query, siweCredentials],
    queryFn: async ({ queryKey: [, query], pageParam = 1 }) => {
      const queryString = toQuerySting({
        ...query,
        page: pageParam,
      } as Partial<TraitsQuery>);
      console.log({ pageParam, queryString });
      return fetch(`/api/traits?${queryString}`).then(
        (r) =>
          r.json() as Promise<{
            traits: (Trait & { liked?: boolean })[];
            traitCount: number;
            totalPages: number;
            pageNumber: number;
          }>
      );
    },
    getNextPageParam: (lastPage) =>
      lastPage.pageNumber < lastPage.totalPages
        ? lastPage.pageNumber + 1
        : undefined,
  });
};
