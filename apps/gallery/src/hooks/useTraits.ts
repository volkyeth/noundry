"use client";

import { TraitsQuery, toQuerySting } from "@/queries/traitsQuery";
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
      const queryString = toQuerySting({
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
    placeholderData: {
      pages: [
        {
          pageNumber: 1,
          traits: new Array(24).fill(undefined),
          traitCount: undefined,
          totalPages: undefined,
        },
      ],
      pageParams: [1],
    },
  });
};
