"use client";

import { TraitsQuery, toQueryString } from "@/schemas/traitsQuery";
import { Trait } from "@/types/trait";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSIWE } from "connectkit";

export interface Traits {
  traits: ((Trait & { liked?: boolean }) | undefined)[];
  traitCount?: number;
  totalPages?: number;
  pageNumber: number;
}

export const useTraits = (query: Partial<TraitsQuery>) => {
  const { data: siweCredentials } = useSIWE();
  return useInfiniteQuery<Traits>({
    queryKey: ["traits", query, siweCredentials],
    queryFn: async ({ queryKey: [, query], pageParam = 1 }) => {
      const queryString = toQueryString({
        ...(query as object),
        page: pageParam,
      } as Partial<TraitsQuery>);
      return fetch(`/api/traits?${queryString}`).then(
        (r) =>
          r.json() as Promise<{
            traits: ((Trait & { liked?: boolean }) | undefined)[];
            traitCount: number;
            totalPages: number;
            pageNumber: number;
          }>
      );
    },
    getNextPageParam: (lastPage) =>
      lastPage.pageNumber < lastPage.totalPages!
        ? lastPage.pageNumber + 1
        : undefined,
  });
};
