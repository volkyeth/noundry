import { InflaterDecoder } from "@/app/lil-nouns/InflaterDecoder";
import { LatestLilNoun } from "@/app/lil-nouns/LatestLilNoun";
import { TraitsList } from "@/app/lil-nouns/TraitsList";

export default function Home() {
  return (
    <main className="flex mx-auto min-h-screen max-w-6xl flex-col items-center gap-4 p-8 sm:p-24">
      <h1 className="text-4xl font-bold mb-10">Lil Nouns Assets</h1>
      <div className="flex flex-col items-center mb-12">
        <p className="text-center max-w-lg mb-4">
          This Lil Noun is generated from the latest onchain Lil Nouns art data,
          using the last trait to be added for each part.
        </p>
        <LatestLilNoun />
        <p className="text-center max-w-lg mt-4">
          It should be always up to date, as soon as props adding new traits are
          executed.
        </p>
      </div>

      <h2 className="text-3xl font-bold mb-6">All Lil Nouns Traits</h2>
      <p className="text-center max-w-2xl mb-8">
        Below is a complete list of all Lil Nouns traits, as they currently
        exist onchain.
      </p>

      <TraitsList />

      <h2 className="text-3xl font-bold mb-6 mt-16">
        Trait Inflater & Decoder
      </h2>
      <p className="text-center max-w-2xl mb-8">
        Enter compressed trait data to decode and render traits. You can use
        this to double check the transactions in proposals that add traits or
        update them.
      </p>

      <InflaterDecoder />
    </main>
  );
}
