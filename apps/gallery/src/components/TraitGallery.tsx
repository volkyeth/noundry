import { useTraits } from "@/hooks/useTraits";
import LoadingNoggles from "public/loading-noggles.svg";
import { FC, HtmlHTMLAttributes } from "react";
import { useInView } from "react-intersection-observer";
import { BlinkingNoggles } from "./BlinkingNoggles";
import { TraitPreviewCard } from "./TraitPreviewCard";

export interface TraitGalleryProps extends HtmlHTMLAttributes<HTMLDivElement> {
  account?: `0x${string}`;
}

export const TraitGallery: FC<TraitGalleryProps> = ({ account, ...props }) => {
  const { data, fetchNextPage, hasNextPage } = useTraits({ account });
  const { ref: loaderRef } = useInView({
    onChange: (inView) => inView && hasNextPage && fetchNextPage(),
  });

  return (
    <div {...props}>
      <div className="container grid grid-cols-[repeat(auto-fill,224px)] justify-center w-full gap-4 mt-6">
        {data?.pages.flatMap(
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
