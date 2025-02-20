"use client";

import { UserBadge } from "@/components/UserBadge";
import { UserStats } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface ArtistsClientProps {
  initialArtistsStats: UserStats[];
}

export function ArtistsClient({ initialArtistsStats }: ArtistsClientProps) {
  const { data: artistsStats } = useQuery({
    queryKey: ["artistsStats"],
    queryFn: () =>
      fetch("/api/artists/stats").then(
        (res) => res.json() as Promise<UserStats[]>,
      ),
    initialData: initialArtistsStats,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="container mx-auto py-10 flex flex-col items-center  gap-6  lg:px-10 md:px-5 sm:px-6  px-6">
      <h1>Artists</h1>
      <div className="grid w-fit grid-cols-[1fr_max-content] mt-10 gap-x-6 gap-y-2 text-default">
        {artistsStats?.map((artist) => (
          <div key={`badge-${artist.address}`} className="contents">
            <Link
              href={`/profile/${artist.address}`}
              className="text-black hover:text-primary  xs:col-span-1 pr-4 "
            >
              <UserBadge address={artist.address} />
            </Link>
            <div className="flex gap-2 justify-end items-center ">
              <p>{artist.traits} traits</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
