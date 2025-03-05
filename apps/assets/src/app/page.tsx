import Link from "next/link";

export default function Home() {
  return (
    <main className="flex mx-auto min-h-screen max-w-lg flex-col items-center gap-4 p-8 sm:p-24">
      <h1 className="text-4xl font-bold mb-10">Noundry Assets</h1>
      <Link href="/nouns">Nouns</Link>
      <Link href="/lil-nouns">Lil Nouns</Link>
    </main>
  );
}
