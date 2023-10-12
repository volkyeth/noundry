import { useTraits } from "@/hooks/useTraits";
import LoadingNoggles from "public/loading-noggles.svg";
import NoggleIcon from "public/mono-noggles.svg";
import { FC, HtmlHTMLAttributes } from "react";
import { useInView } from "react-intersection-observer";
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
      {data?.pages && (
        <>
          <div className="container grid grid-cols-[repeat(auto-fill,224px)] justify-center w-full gap-4 mt-6">
            {data.pages.flatMap(
              (page) =>
                page.traits?.map((trait) => (
                  <TraitPreviewCard key={`card-${trait.id}`} trait={trait} />
                ))
            )}
          </div>
          <div
            ref={loaderRef}
            className="mt-10 h-10 w-full flex justify-center"
          >
            {hasNextPage ? (
              <LoadingNoggles className="w-[64px] text-default-300" />
            ) : (
              <NoggleIcon className="w-[64px] text-default-300" />
            )}
          </div>
        </>
      )}
    </div>
  );
};
