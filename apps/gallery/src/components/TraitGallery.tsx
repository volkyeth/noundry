import { TRAITS_PAGE_SIZE } from "@/constants/config";
import { useTraits } from "@/hooks/useTraits";
import LoadingNoggles from "public/loading-noggles.svg";
import { FC, HtmlHTMLAttributes, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { BlinkingNoggles } from "./BlinkingNoggles";
import { TraitPreviewCard } from "./TraitPreviewCard";

export interface TraitGalleryProps extends HtmlHTMLAttributes<HTMLDivElement> {
  account?: `0x${string}`;
  includeTypes?: ("heads" | "glasses" | "accessories" | "bodies")[];
}

export const TraitGallery: FC<TraitGalleryProps> = ({
  account,
  includeTypes,
  ...props
}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetched } =
    useTraits({
      account,
      includeTypes,
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
