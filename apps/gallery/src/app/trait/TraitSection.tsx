"use client";
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
import { SubmissionCard } from "@/components/SubmissionCard";
import { SubmissionPreviewCard } from "@/components/SubmissionPreviewCard";
import { TraitTestingGrounds } from "@/components/TraitTestGrounds";
import { TraitWithFriends } from "@/components/TraitWithFriends";
import { UserAvatar } from "@/components/UserAvatar";
import { useSignedInMutation } from "@/hooks/useSignedInMutation";
import { Trait } from "@/types/trait";
import { UserInfo } from "@/types/user";
import { traitType } from "@/utils/misc/traitType";
import { formatSubmissionType } from "@/utils/traits/format";
import { appConfig } from "@/variants/config";
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
    queryFn: async () => {
      const response = await fetch(`/api/trait/${initialTrait.id}`);
      if (!response.ok) throw new Error('Failed to fetch trait');
      return response.json() as Promise<Trait & { liked?: boolean }>;
    },
    initialData: initialTrait as Trait & { liked?: boolean },
  });

  const { data: remixedFrom } = useQuery({
    queryKey: ["trait", initialTrait.remixedFrom],
    queryFn: async () => {
      const response = await fetch(`/api/trait/${initialTrait.remixedFrom!}`);
      if (!response.ok) throw new Error('Failed to fetch remixed trait');
      return response.json();
    },
    enabled: !!initialTrait.remixedFrom,
  });

  const isCreator =
    address && trait.address.toLowerCase() === address.toLowerCase();

  const { push } = useRouter();

  // Generate studio URL with trait data for remixing
  const getRemixUrl = () => {
    const studioUrl = process.env.NEXT_PUBLIC_STUDIO_URL || appConfig.studioUrl;
    const params = new URLSearchParams();

    // Add remix reference
    params.set("remixedFrom", trait.id);

    // Add seed values if available
    if (trait.seed) {
      if (trait.seed.accessory !== undefined)
        params.set("accessory", trait.seed.accessory.toString());
      if (trait.seed.background !== undefined)
        params.set("background", trait.seed.background.toString());
      if (trait.seed.body !== undefined)
        params.set("body", trait.seed.body.toString());
      if (trait.seed.glasses !== undefined)
        params.set("glasses", trait.seed.glasses.toString());
      if (trait.seed.head !== undefined)
        params.set("head", trait.seed.head.toString());
    }

    // Add the trait data URI for the specific trait type (only for trait submissions, not full nouns)
    if (trait.type !== "nouns") {
      const traitTypeKey = traitType(trait);
      params.set(traitTypeKey, trait.trait);
      // Add the remixed part type so we know which part this remix came from
      params.set("remixedPart", traitTypeKey);
    }

    return `${studioUrl}?${params.toString()}`;
  };

  const { isPending: isDeleting, mutateAsync: deleteTrait } =
    useSignedInMutation({
      mutationFn: () =>
        fetch(`/api/trait/${initialTrait.id}`, { method: "DELETE" }),
    });

  return (
    <div className="container mx-auto py-4 lg:p-10">
      <div className="flex flex-col items-center lg:items-start justify-center lg:flex-row gap-10 lg:gap-16 p-4">
        <div className="flex flex-col gap-2 w-min relative">
          <SubmissionCard
            name={trait.name}
            type={trait.type}
            version={trait.version}
            className="z-10"
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
                  <p className="text-xs  text-default-400">
                    {formatDistanceToNow(trait.creationDate, {
                      addSuffix: true,
                    })}{" "}
                  </p>
                  <Link
                    href={`/profile/${author.address}`}
                    as={NextLink}
                    color="foreground"
                    className="text-sm flex gap-1 text-default-500"
                  >
                    <UserAvatar
                      address={author.address}
                      className="rounded-full"
                    />
                    <div className="flex flex-col leading-none">
                      <span className="font-bold text-default-500">
                        {author.userName}
                      </span>
                    </div>
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
          <div className="flex w-full gap-2 justify-between">
            <div className="flex gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="ghost"
                    className="h-fit p-2 text-default hover:text-black"
                  >
                    Remix
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Remix options">
                  <DropdownItem>
                    <NextLink
                      href={getRemixUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      Remix on studio
                    </NextLink>
                  </DropdownItem>
                  <DropdownItem>
                    <NextLink
                      href={`/submit?remixedFrom=${trait.id}`}
                      className="w-full"
                    >
                      Submit remix
                    </NextLink>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dynamic>
                {isCreator &&
                  trait.type !== "nouns" &&
                  (appConfig.traitUpdatesEnabled ? (
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
                  ) : (
                    <NextLink href={`/propose/${trait.id}`}>
                      <Button
                        variant="ghost"
                        className="h-fit p-2 text-default hover:text-black"
                      >
                        Propose
                      </Button>
                    </NextLink>
                  ))}
              </Dynamic>
            </div>
            <div className="flex gap-2">
              <Link
                download={slugify(
                  `${trait.name}-${formatSubmissionType(trait.type)}.png`,
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
              <Dynamic>
                {isCreator && (
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
          {trait.remixedFrom && remixedFrom !== null && (
            <div className="flex flex-col  mx-auto mt-4 gap-0.5 w-fit items-center xl:items-start  xl:-rotate-12 xl:absolute xl:top-40 xl:-left-44">
              <p className="text-xs font-bold tracking-widest text-gray-500">
                REMIXED FROM
              </p>
              <SubmissionPreviewCard trait={remixedFrom} />
            </div>
          )}
        </div>

        {trait.type !== "nouns" && (
          <div className="flex w-full flex-col gap-4 max-w-xl">
            <>
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
            </>
          </div>
        )}
      </div>
    </div>
  );
};
