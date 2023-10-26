"use client";
import { getTrait } from "@/app/api/trait/[id]/getTrait";
import { getUserInfo } from "@/app/api/user/[address]/info/getUserInfo";
import { LikeWidget } from "@/components/LikeWidget";
import { TraitCard } from "@/components/TraitCard";
import { TraitTestingGrounds } from "@/components/TraitTestGrounds";
import { UserBadge } from "@/components/UserBadge";
import { Trait } from "@/types/trait";
import { UserInfo } from "@/types/user";
import { traitType } from "@/utils/misc/traitType";
import Session from "@/utils/siwe/session";
import { formatTraitType } from "@/utils/traits/format";
import { Link } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { SIWESession, useSIWE } from "connectkit";
import { formatDistanceToNow } from "date-fns";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import NextLink from "next/link";

export const getServerSideProps: GetServerSideProps<{
  trait: Trait;
  author: UserInfo;
  requesterAddress: `0x${string}` | null;
}> = async ({ req: { cookies }, params }) => {
  if (!params?.id) {
    return {
      notFound: true,
    };
  }
  const session = await Session.fromCookies(cookies);

  const trait = (await getTrait(params.id as string, {
    requester: session.address,
  })) as Trait;

  const author = await getUserInfo(trait.address);

  return {
    props: { trait, author, requesterAddress: session.address ?? null },
  };
};

const TraitPage: NextPage<{
  trait: Trait & { liked?: boolean };
  author: UserInfo;
  requesterAddress: `0x${string}` | null;
}> = ({ trait: initialTrait, author, requesterAddress }) => {
  const { data: siweCredentials } = useSIWE();
  const address = (siweCredentials as SIWESession)?.address ?? requesterAddress;
  const { data: trait } = useQuery({
    queryKey: ["trait", initialTrait.id, address],
    queryFn: () =>
      fetch(`/api/trait/${initialTrait.id}`).then(
        (r) => r.json() as Promise<Trait & { liked?: boolean }>
      ),

    initialData: initialTrait,
  });

  return (
    <div className="container mx-auto py-4 lg:p-10">
      <Head>
        <title>{`${trait.name} ${formatTraitType(trait.type)}`}</title>
        <meta
          name="description"
          content={`${trait.name} ${formatTraitType(trait.type)}\nCreated by: ${
            author.userName
          }`}
          key="desc"
        />
        <meta
          property="og:title"
          content={`${trait.name} ${formatTraitType(trait.type)}`}
        />
        <meta
          property="og:description"
          content={`${trait.name} ${formatTraitType(trait.type)}\nCreated by: ${
            author.userName
          }`}
        />
        <meta property="og:image" content={`/api/trait/${trait.id}/og`} />
      </Head>
      <div className="flex flex-col items-center lg:items-start justify-center lg:flex-row gap-10 lg:gap-16">
        <TraitCard
          name={trait.name}
          type={trait.type}
          image={<img alt="Trait preview" src={trait.trait} />}
          previewImage={<img alt="Trait preview" src={trait.nft} />}
          footer={
            <>
              <div className="flex flex-col gap-2 text-medium">
                <p className="text-sm  text-default-500">
                  {formatDistanceToNow(trait.creationDate, { addSuffix: true })}{" "}
                  by
                </p>
                <Link
                  href={`/profile/${author}`}
                  as={NextLink}
                  color="foreground"
                  className="text-sm text-default-500"
                >
                  <UserBadge address={author.address} />
                </Link>
              </div>
              <LikeWidget
                liked={trait.liked}
                likesCount={trait.likesCount}
                traitId={trait.id}
              />
            </>
          }
        />

        <TraitTestingGrounds
          traitType={traitType(trait)}
          trait={trait.trait}
          className=" h-[85vh] w-full lg:max-w-xl "
        />
      </div>
    </div>
  );
};

export default TraitPage;
