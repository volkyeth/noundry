"use client";
import { getTrait } from "@/app/api/trait/[id]/route";
import { TraitCard } from "@/components/TraitCard";
import { TraitTestingGrounds } from "@/components/TraitTestGrounds";
import { Trait } from "@/types/trait";
import Session from "@/utils/siwe/session";
import { useQuery } from "@tanstack/react-query";
import { SIWESession, useSIWE } from "connectkit";
import { GetServerSideProps, NextPage } from "next";

export const getServerSideProps: GetServerSideProps<{
  trait: Trait;
  requesterAddress: `0x${string}` | null;
}> = async ({ req: { cookies }, params }) => {
  if (!params?.id) {
    return {
      notFound: true,
    };
  }
  const session = await Session.fromCookies(cookies);

  const trait = (await getTrait(params.id as string, session.address)) as Trait;

  return {
    props: { trait, requesterAddress: session.address ?? null },
  };
};

const TraitPage: NextPage<{
  trait: Trait;
  requesterAddress: `0x${string}` | null;
}> = ({ trait: initialTrait, requesterAddress }) => {
  const { data: siweCredentials } = useSIWE();
  const address = (siweCredentials as SIWESession)?.address ?? requesterAddress;
  console.log({ siweCredentials, address, requesterAddress });
  const { data: trait } = useQuery({
    queryKey: ["trait", initialTrait.id, address],
    queryFn: () =>
      fetch(`/api/trait/${initialTrait.id}`).then(
        (r) => r.json() as Promise<Trait>
      ),

    initialData: initialTrait,
  });

  return (
    <div className="container mx-auto py-4 lg:p-10">
      <div className="flex flex-col items-center justify-center  lg:flex-row gap-10 lg:gap-16">
        <TraitCard trait={trait!} />
        <TraitTestingGrounds
          trait={trait!}
          className=" h-[484px] w-full max-w-xl "
        />
      </div>
    </div>
  );
};

export default TraitPage;
