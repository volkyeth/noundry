import { TRAITS_PAGE_SIZE } from "@/constants/config";
import { useTraits } from "@/hooks/useTraits";
import { SortCriteria } from "@/types/sort";
import LoadingNoggles from "public/loading-noggles.svg";
import { FC, HtmlHTMLAttributes, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { BlinkingNoggles } from "./BlinkingNoggles";
import { TraitPreviewCard } from "./TraitPreviewCard";

export interface TraitGalleryProps extends HtmlHTMLAttributes<HTMLDivElement> {
  creator?: `0x${string}`;
  likedBy?: `0x${string}`;
  includeTypes?: ("heads" | "glasses" | "accessories" | "bodies")[];
  sortBy?: SortCriteria;
  search?: string;
}

export const TraitGallery: FC<TraitGalleryProps> = ({
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
                : 0
            ).fill(undefined),
          },
        ].flatMap(
          (page) =>
            page?.traits.map((trait, i) => (
              <TraitPreviewCard key={`card-${trait?.id ?? i}`} trait={trait} />
            ))
        )}
      </div>
      {isFetched && !data?.pages?.[0]?.traits.length && (
        <p className="py-24 text-center text-xl text-default-300">
          {search ? `No results for "${search}"` : "Nothing here yet"}
        </p>
      )}
      <div
        ref={loaderRef}
        className="mt-10 h-10 w-full flex flex-col items-center gap-2"
      >
        {hasNextPage ? (
          <LoadingNoggles className="w-[64px] text-default-300" />
        ) : (
          <BlinkingNoggles className="w-[64px] h-[24px] shrink-0 text-default-300" />
        )}
        {!hasNextPage && (
          <p className="text-xl font-semibold text-default-300">
            A Nouns thing
          </p>
        )}
      </div>
    </div>
  );
};
