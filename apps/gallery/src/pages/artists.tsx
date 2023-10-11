"use client";
import { getArtistStats } from "@/app/api/artists/stats/route";
import { SmallAccountBadge } from "@/components/SmallAccountBadge";
import { TraitIcon } from "@/components/TraitIcon";
import { UserStats } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps<{
  artistsStats: UserStats[];
}> = async () => {
  const artistsStats = await getArtistStats();
  return {
    props: { artistsStats: artistsStats as UserStats[] },
  };
};

export default (({ artistsStats: initialArtistsStats }) => {
  const { data: artistsStats } = useQuery({
    queryKey: ["artistsStats"],
    queryFn: () =>
      fetch("/api/artists/stats").then(
        (res) => res.json() as Promise<UserStats[]>
      ),
    initialData: initialArtistsStats,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="container mx-auto py-10 flex flex-col gap-6 xl:px-10 lg:px-10 md:px-5 sm:px-6 xs:px-2 px-8">
      <div className="w-full flex justify-between items-center">
        <h1 className="font-Pix text-4xl sm:text-lg dsm:text-lg md:text-lg lg:text-2xl">
          Artists
        </h1>
      </div>
      <div className="grid grid-cols-[repeat(4,max-content)] mt-10 gap-x-6 gap-y-2">
        {artistsStats?.map((artist) => (
          <Link
            key={artist.id}
            href={`/profile/${artist.id}`}
            className="contents hover:text-primary"
          >
            <SmallAccountBadge key={artist.id} address={artist.id} />
            <div className="flex gap-2 items-center text-default">
              <p>Traits: {artist.traits}</p>
            </div>
            <div className="flex gap-2 items-center text-default">
              <TraitIcon className="w-6" type="heads" />
              <p>{artist.heads}</p>
            </div>
            <div className="flex gap-2 items-center text-default">
              <TraitIcon className="w-6" type="accessories" />
              <p>{artist.accessories}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}) satisfies NextPage<{ artistsStats: UserStats[] }>;
