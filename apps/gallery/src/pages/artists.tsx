"use client";
import { getArtistStats } from "@/app/api/artists/stats/route";
import { TraitIcon } from "@/components/TraitIcon";
import { UserBadge } from "@/components/UserBadge";
import { UserStats } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps<{
  artistsStats: UserStats[];
}> = async () => {
  const artistsStats = await getArtistStats();
  return {
    props: { artistsStats: artistsStats as UserStats[] },
  };
};

export default function ArtistsPage({ artistsStats: initialArtistsStats }) {
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
    <div className="container mx-auto py-10 flex flex-col items-center  gap-6  lg:px-10 md:px-5 sm:px-6  px-6">
      <h1 className="font-Pix text-lg xl:text-4xl sm:text-lg dsm:text-lg md:text-lg lg:text-2xl">
        Artists
      </h1>
      <div className="grid w-fit grid-cols-[1fr_max-content] xs:grid-cols-[repeat(4,max-content)] mt-10 gap-x-6 gap-y-2 text-default">
        {artistsStats?.map((artist) => (
          <>
            <Link
              key={artist.id}
              href={`/profile/${artist.id}`}
              className="text-black hover:text-primary  xs:col-span-1 pr-4 "
            >
              <UserBadge key={artist.id} address={artist.id} />
            </Link>
            <div className="flex gap-2 justify-end items-center ">
              <p>{artist.traits} traits</p>
            </div>
            <div className="flex gap-2 items-center justify-end hidden xs:flex">
              <p>{artist.heads}</p>
              <TraitIcon className="w-6" type="heads" />
            </div>
            <div className="flex gap-2 items-center justify-end hidden xs:flex">
              <p>{artist.accessories}</p>
              <TraitIcon className="w-6" type="accessories" />
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
