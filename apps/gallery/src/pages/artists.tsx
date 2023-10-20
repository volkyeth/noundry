"use client";
import { getArtistStats } from "@/app/api/artists/stats/getArtistStats";
import { TraitIcon } from "@/components/TraitIcon";
import { UserBadge } from "@/components/UserBadge";
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

const ArtistsPage: NextPage<{ artistsStats: UserStats[] }> = ({
  artistsStats: initialArtistsStats,
}) => {
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
      <h1>Artists</h1>
      <div className="grid w-fit grid-cols-[1fr_max-content] xs:grid-cols-[repeat(4,max-content)] mt-10 gap-x-6 gap-y-2 text-default">
        {artistsStats?.map((artist) => (
          <>
            <Link
              key={`badge-${artist.address}`}
              href={`/profile/${artist.address}`}
              className="text-black hover:text-primary  xs:col-span-1 pr-4 "
            >
              <UserBadge address={artist.address} />
            </Link>
            <div
              key={`trait-count-${artist.address}`}
              className="flex gap-2 justify-end items-center "
            >
              <p>{artist.traits} traits</p>
            </div>
            <div
              key={`head-count-${artist.address}`}
              className="gap-2 items-center justify-end hidden xs:flex"
            >
              <p>{artist.heads}</p>
              <TraitIcon className="w-6" type="heads" />
            </div>
            <div
              key={`accessory-count-${artist.address}`}
              className="gap-2 items-center justify-end hidden xs:flex"
            >
              <p>{artist.accessories}</p>
              <TraitIcon className="w-6" type="accessories" />
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default ArtistsPage;
