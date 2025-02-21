import { Noun } from "@/app/Noun";

export default function Home() {
  return (
    <main className="flex mx-auto min-h-screen max-w-lg flex-col items-center gap-4 p-8 sm:p-24">
      <h1 className="text-4xl font-bold mb-10">Noundry Assets</h1>
      <p>
        This Noun is generated from the latest onchain Nouns art data, using the
        last trait to be added for each part.
      </p>
      <Noun />
      <p>
        It should be always up to date, as soon as props adding new traits are
        executed.
      </p>
    </main>
  );
}
