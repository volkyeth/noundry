"use client";
import { getTrait } from "@/app/api/trait/[id]/route";
import { TraitCard } from "@/components/TraitCard";
import { Trait } from "@/types/trait";
import Session from "@/utils/siwe/session";
import { GetServerSideProps, NextPage } from "next";

export const getServerSideProps: GetServerSideProps<Trait> = async ({
  req: { cookies },
  params,
}) => {
  if (!params?.id) {
    return {
      notFound: true,
    };
  }
  const session = Session.fromCookies(cookies);

  const trait = (await getTrait(
    params.id as string,
    (await session).address
  )) as Trait;

  return {
    props: trait,
  };
};

export default ((trait) => {
  return (
    <div className="container mx-auto p-10">
      <TraitCard trait={trait} />
    </div>
  );
}) satisfies NextPage<Trait>;
