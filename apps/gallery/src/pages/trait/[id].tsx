"use client";
import { getTrait } from "@/app/api/trait/[id]/getTrait";
import { getUserInfo } from "@/app/api/user/[address]/info/getUserInfo";
import { Button } from "@/components/Button";
import Dynamic from "@/components/Dynamic";
import { LikeWidget } from "@/components/LikeWidget";
import {
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Popover";
import { TraitCard } from "@/components/TraitCard";
import { TraitTestingGrounds } from "@/components/TraitTestGrounds";
import { UserBadge } from "@/components/UserBadge";
import { SITE_URI } from "@/constants/config";
import { useSignedInMutation } from "@/hooks/useSignedInMutation";
import { Trait } from "@/types/trait";
import { UserInfo } from "@/types/user";
import { traitType } from "@/utils/misc/traitType";
import { formatTraitType } from "@/utils/traits/format";
import { Link } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";

export const getStaticProps: GetStaticProps<{
  trait: Trait;
  author: UserInfo;
}> = async ({ params }) => {
  if (!params?.id) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  const trait = await getTrait(params.id as string);

  if (!trait) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  const author = await getUserInfo(trait.address);

  //delete undefined props because they're not serializeable
  Object.keys(author).forEach(
    (key) => author[key] === undefined && delete author[key]
  );

  return {
    props: { trait, author },
    revalidate: 900,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { fallback: "blocking", paths: [] };
};

const TraitPage: NextPage<{
  trait: Trait & { liked?: boolean };
  author: UserInfo;
}> = ({ trait: initialTrait, author }) => {
  const { address } = useAccount();
  const { data: trait } = useQuery({
    queryKey: ["trait", initialTrait.id, address],
    queryFn: () =>
      fetch(`/api/trait/${initialTrait.id}`).then(
        (r) => r.json() as Promise<Trait & { liked?: boolean }>
      ),
    initialData: initialTrait,
  });

  const isCreator =
    address && trait.address.toLowerCase() === address.toLowerCase();

  const { push } = useRouter();

  const { isLoading: isDeleting, mutateAsync: deleteTrait } =
    useSignedInMutation({
      mutationFn: () =>
        fetch(`/api/trait/${initialTrait.id}`, { method: "DELETE" }),
    });

  return (
    <div className="container mx-auto py-4 lg:p-10">
      <Head>
        <meta
          key="title"
          name="title"
          property="og:title"
          content={`${trait.name} ${formatTraitType(trait.type)}`}
        />
        <meta
          key="description"
          name="description"
          property="og:description"
          content={`Created by: ${author.userName}`}
        />

        <meta
          key="og:image"
          name="og:image"
          content={`${SITE_URI}/api/trait/${trait.id}/og`}
        />

        <meta
          key="twitter:image"
          name="twitter:image"
          content={`${SITE_URI}/api/trait/${trait.id}/og`}
        />
      </Head>
      <div className="flex flex-col items-center lg:items-start justify-center lg:flex-row gap-10 lg:gap-16">
        <div className="flex flex-col gap-2">
          <TraitCard
            name={trait.name}
            type={trait.type}
            image={
              <img
                alt="Trait preview"
                src={trait.trait}
                className="w-full h-full"
              />
            }
            previewImage={
              <img
                alt="Trait preview"
                src={trait.nft}
                className="w-full h-full"
              />
            }
            footer={
              <>
                <div className="flex flex-col gap-2 text-medium">
                  <p className="text-sm  text-default-500">
                    {formatDistanceToNow(trait.creationDate, {
                      addSuffix: true,
                    })}{" "}
                    by
                  </p>
                  <Link
                    href={`/profile/${author.address}`}
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
          <div className="flex w-full justify-end">
            <Dynamic>
              {isCreator && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-fit p-2 text-default hover:text-black"
                    >
                      <svg
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M16 2v4h6v2h-2v14H4V8H2V6h6V2h8zm-2 2h-4v2h4V4zm0 4H6v12h12V8h-4zm-5 2h2v8H9v-8zm6 0h-2v8h2v-8z"
                          fill="currentColor"
                        />{" "}
                      </svg>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    collisionPadding={10}
                    className="flex p-4 bg-content1 gap-4 shadow-sm drop-shadow-md z-50"
                  >
                    <PopoverArrow className="fill-content1 w-6 h-2" />
                    <Button
                      isLoading={isDeleting}
                      loadingContent={"Deleting"}
                      className="bg-danger-500"
                      onClick={() => {
                        deleteTrait().then(() => push(`/profile/${address}`));
                      }}
                    >
                      Delete
                    </Button>
                    <PopoverClose asChild>
                      <Button variant="ghost">Cancel</Button>
                    </PopoverClose>
                  </PopoverContent>
                </Popover>
              )}
            </Dynamic>
          </div>
        </div>

        <TraitTestingGrounds
          traitType={traitType(trait)}
          trait={trait.trait}
          className=" h-[85vh] w-full lg:max-w-xl"
        />
      </div>
    </div>
  );
};

export default TraitPage;
