import { getArtistStats } from "@/app/api/artists/stats/getArtistStats";
import { ArtistsClient } from "./client";

export default async function Artists() {
  const artistsStats = await getArtistStats();

  return <ArtistsClient initialArtistsStats={artistsStats} />;
}
