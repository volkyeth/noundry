"use client";
import { getTrait } from "@/app/actions/getTrait";
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
import { TraitComments } from "@/components/TraitComments";
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
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { useAccount } from "wagmi";

export interface TraitSectionProps {
  trait: Trait;
  author: UserInfo;
}

export const TraitSection: FC<TraitSectionProps> = ({
  trait: initialTrait,
  author,
}) => {
  const { address } = useAccount();
  const { data: trait } = useQuery({
    queryKey: ["trait", initialTrait.id, address],
    queryFn: () =>
      getTrait(initialTrait.id, { requester: address }) as Promise<
        Trait & { liked?: boolean }
      >,
    initialData: initialTrait as Trait & { liked?: boolean },
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
          content={`${trait.name} ${formatTraitType(trait.type)}`}
        />
        <meta
          key="og:title"
          name="og:title"
          content={`${trait.name} ${formatTraitType(trait.type)}`}
        />
        <meta
          key="description"
          name="description"
          content={`Created by: ${author.userName}`}
        />
        <meta
          key="og:description"
          name="og:description"
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
        <div className="flex flex-col gap-2 w-min">
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
                  liked={trait?.liked ?? false}
                  likesCount={trait.likesCount}
                  traitId={trait.id}
                />
              </>
            }
          />
          <div className="flex w-full gap-2 justify-end">
            <Dynamic>
              {isCreator && (
                <>
                  <NextLink href={`/propose/${trait.id}`}>
                    <Button
                      variant="ghost"
                      className="h-fit p-2 text-default hover:text-black"
                    >
                      Propose
                    </Button>
                  </NextLink>
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
                </>
              )}
            </Dynamic>
          </div>
          <TraitComments trait={trait} />
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
