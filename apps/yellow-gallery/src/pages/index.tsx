"use client";

import { GalleryQueryBar } from "@/components/GalleryQueryBar";
import { TraitGallery } from "@/components/TraitGallery";
import { useIncludeTraitTypes } from "@/hooks/useIncludeTraitTypes";
import { useSortBy } from "@/hooks/useSortBy";
import { useTraitSearch } from "@/hooks/useTraitSearch";

export default function Home() {
  const [includeTypes] = useIncludeTraitTypes();
  const [sortBy] = useSortBy();
  const [search] = useTraitSearch();
  return (
    <>
      <GalleryQueryBar />
      <TraitGallery
        className="w-fit px-2 self-center my-12 mx-auto"
        includeTypes={includeTypes ?? undefined}
        sortBy={sortBy}
        search={search}
      />
    </>
  );
}
