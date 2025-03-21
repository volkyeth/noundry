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
import { TraitTestingGrounds } from "@/components/TraitTestGrounds";
import { TraitWithFriends } from "@/components/TraitWithFriends";
import { UserBadge } from "@/components/UserBadge";
import { useSignedInMutation } from "@/hooks/useSignedInMutation";
import { Trait } from "@/types/trait";
import { UserInfo } from "@/types/user";
import { traitType } from "@/utils/misc/traitType";
import { formatTraitType } from "@/utils/traits/format";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import Download from "pixelarticons/svg/download.svg";
import Trash from "pixelarticons/svg/trash.svg";
import { FC } from "react";
import slugify from "slugify";
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

  const { isPending: isDeleting, mutateAsync: deleteTrait } =
    useSignedInMutation({
      mutationFn: () =>
        fetch(`/api/trait/${initialTrait.id}`, { method: "DELETE" }),
    });

  return (
    <div className="container mx-auto py-4 lg:p-10">
      <div className="flex flex-col items-center lg:items-start justify-center lg:flex-row gap-10 lg:gap-16 p-4">
        <div className="flex flex-col gap-2 w-min">
          <TraitCard
            name={trait.name}
            type={trait.type}
            image={
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt="Trait preview"
                src={trait.trait}
                className="w-full h-full"
              />
            }
            previewImage={
              // eslint-disable-next-line @next/next/no-img-element
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
                <div className="flex justify-between w-full">
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        variant="ghost"
                        className="h-fit p-2 text-default hover:text-black"
                      >
                        Propose
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Propose actions">
                      <DropdownItem>
                        <NextLink
                          href={`/propose/${trait.id}`}
                          className="w-full"
                        >
                          Propose new trait
                        </NextLink>
                      </DropdownItem>
                      <DropdownItem>
                        <NextLink
                          href={`/propose-update/${trait.id}`}
                          className="w-full"
                        >
                          Propose trait update
                        </NextLink>
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                  <div className="flex">
                    <Link
                      download={slugify(
                        `${trait.name}-${formatTraitType(trait.type)}.png`,
                      )}
                      href={trait.trait}
                    >
                      <Button
                        variant="ghost"
                        className="h-fit p-2 text-default hover:text-black"
                      >
                        <Download className="w-6" />
                      </Button>
                    </Link>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-fit p-2 text-default hover:text-black"
                        >
                          <Trash className="w-6" />
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
                            deleteTrait().then(() =>
                              push(`/profile/${address}`),
                            );
                          }}
                        >
                          Delete
                        </Button>
                        <PopoverClose asChild>
                          <Button variant="ghost">Cancel</Button>
                        </PopoverClose>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            </Dynamic>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 max-w-xl">
          <TraitTestingGrounds
            traitType={traitType(trait)}
            trait={trait.trait}
            className="relative h-fit w-full"
            classNames={{ card: "pb-10" }}
            lanes={2}
          />

          <TraitWithFriends
            traitType={traitType(trait)}
            trait={trait.trait}
            className="relative h-fit w-full"
          />
        </div>
      </div>
    </div>
  );
};
