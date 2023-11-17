"use client";

import { TraitGallery } from "@/components/TraitGallery";
import { useIncludeTypesState } from "@/hooks/useIncludeTypesState";

export default function Home() {
  const [includeTypes] = useIncludeTypesState();
  return (
    <TraitGallery
      className="w-fit px-2 self-center my-12 mx-auto"
      includeTypes={includeTypes ?? undefined}
    />
  );
}
