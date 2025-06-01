import { TRAITS_PAGE_SIZE } from "@/constants/config";
import { useTraits } from "@/hooks/useTraits";
import { SortCriteria } from "@/types/sort";
import { FC, HtmlHTMLAttributes, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { SubmissionPreviewCard } from "./SubmissionPreviewCard";

export interface GalleryProps extends HtmlHTMLAttributes<HTMLDivElement> {
  creator?: `0x${string}`;
  likedBy?: `0x${string}`;
  includeTypes?: ("heads" | "glasses" | "accessories" | "bodies" | "nouns")[];
  sortBy?: SortCriteria;
  search?: string;
}

export const Gallery: FC<GalleryProps> = ({
  creator,
  likedBy,
  includeTypes,
  sortBy,
  search,
  ...props
}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetched } =
    useTraits({
      creator,
      likedBy,
      includeTypes,
      sortBy,
      search,
    });

  const { ref: loaderRef, inView } = useInView({
    rootMargin: "600px",
  });

  useEffect(() => {
    if (!inView || !hasNextPage || isFetchingNextPage) return;

    fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const loadedTraits =
    data?.pages?.reduce((count, page) => count + page.traits.length, 0) ?? 0;
  const traitsRemaining =
    (data?.pages?.[data.pages.length - 1].traitCount ?? TRAITS_PAGE_SIZE) -
    loadedTraits;

  return (
    <div {...props}>
      <div className="container grid grid-cols-[repeat(auto-fill,224px)] justify-center w-full gap-4 mt-6">
        {[
          ...(data?.pages ?? []),
          {
            traits: new Array(
              isFetchingNextPage || !isFetched
                ? Math.min(traitsRemaining, TRAITS_PAGE_SIZE)
                : 0,
            ).fill(undefined),
          },
        ].flatMap(
          (page) =>
            page?.traits.map((trait, i) => (
              <SubmissionPreviewCard
                key={`card-${trait?.id ?? i}`}
                trait={trait}
              />
            )),
        )}
      </div>
      {isFetched && !data?.pages?.[0]?.traits.length && (
        <p className="py-24 text-center text-xl text-default-300">
          {search ? `No results for "${search}"` : "Nothing here yet"}
        </p>
      )}
      <div ref={loaderRef} />
    </div>
  );
};
