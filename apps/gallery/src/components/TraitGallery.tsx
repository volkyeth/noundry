import { useTraits } from "@/hooks/useTraits";
import LoadingNoggles from "public/loading-noggles.svg";
import NoggleIcon from "public/mono-noggles.svg";
import { FC } from "react";
import { useInView } from "react-intersection-observer";
import TraitCard from "./TraitCard";

export interface TraitGalleryProps {
  account?: `0x${string}`;
}

export const TraitGallery: FC<TraitGalleryProps> = ({ account }) => {
  const { data, fetchNextPage, hasNextPage } = useTraits({ account });
  const { ref: loaderRef } = useInView({
    onChange: (inView) => inView && hasNextPage && fetchNextPage(),
  });

  return (
    <>
      <div className="container mx-auto my-12 xl:px-10 lg:px-10 md:px-5 sm:px-2 xs:px-2 px-4">
        {data?.pages && (
          <>
            <div className="container grid grid-cols-2 gap-4 mt-6 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-2 2xl:grid-cols-4 sm:grid-cols-1 sm:px-4">
              {data.pages.flatMap((page) =>
                page.traits.map((trait) => (
                  <TraitCard key={`card-${trait._id}`} trait={trait} />
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
    </>
  );
};
