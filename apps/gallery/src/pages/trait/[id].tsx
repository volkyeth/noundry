"use client";
import { getTrait } from "@/app/api/trait/[id]/route";
import { TraitCard } from "@/components/TraitCard";
import { TraitTestingGrounds } from "@/components/TraitTestGrounds";
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

const TraitPage: NextPage<Trait> = (trait) => {
  return (
    <div className="container mx-auto py-4 lg:p-10">
      <div className="flex flex-col items-center justify-center  lg:flex-row gap-10 lg:gap-16">
        <TraitCard trait={trait} />
        <TraitTestingGrounds
          trait={trait}
          className=" h-[484px] w-full max-w-xl "
        />
      </div>
    </div>
  );
};

export default TraitPage;
