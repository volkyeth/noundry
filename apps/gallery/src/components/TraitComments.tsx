import { Trait } from "@/types/trait";
import { formatTraitType } from "@/utils/traits/format";
import { Thread, thread, user } from "@cord-sdk/react";
import { Link } from "@nextui-org/react";
import { useModal } from "connectkit";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

export interface TraitCommentsProps {
  trait: Trait;
}

export const TraitComments: FC<TraitCommentsProps> = ({ trait }) => {
  const { openSIWE } = useModal();
  const cordUserData = user.useViewerData();
  const isWalletConnected = cordUserData && cordUserData?.id !== "shared-anon";
  const cordThread = thread.useThread(`trait-${trait.id}`);
  const hasMessages = !!cordThread?.thread?.firstMessage;

  return (
    <>
      <Thread
        threadId={`trait-${trait.id}`}
        threadName={`${trait.name} ${formatTraitType(trait.type)}`}
        showHeader={false}
        showPlaceholder={false}
        composerExpanded={false}
        collapsed={false}
        threadOptions={{ additional_subscribers_on_create: [trait.address] }}
        location={{ page: "trait", id: trait.id }}
        className={twMerge(
          "max-h-96",
          isWalletConnected ? undefined : "noWalletConnected"
        )}
      >
        {isWalletConnected || hasMessages ? undefined : (
          <div className="flex justify-center !p-4">
            <Link
              color="secondary"
              onClick={() => openSIWE()}
              className="mx-auto cursor-pointer"
            >
              Sign in to comment
            </Link>
          </div>
        )}
      </Thread>
      {!isWalletConnected && hasMessages && (
        <div className="bg-de flex justify-center !p-4">
          <Link
            color="secondary"
            onClick={() => openSIWE()}
            className="mx-auto text-sm cursor-pointer"
          >
            Sign in to comment
          </Link>
        </div>
      )}
    </>
  );
};
