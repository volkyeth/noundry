import { useSignedInMutation } from "@/hooks/useSignedInMutation";
import LoadingNoggles from "public/loading-noggles.svg";
import { FC } from "react";
import { BlinkingNoggles } from "./BlinkingNoggles";

export interface LikeWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  traitId: string;
  liked?: boolean;
  likesCount: number;
}
export const LikeWidget: FC<LikeWidgetProps> = ({
  traitId,
  liked: initiallyLiked,
  likesCount: initialLikesCount,
  ...props
}) => {
  const {
    data: currentlyLiked,
    isLoading: liking,
    mutate: toggleLike,
  } = useSignedInMutation({
    mutationFn: (isLiked: boolean) =>
      fetch(`/api/like/${traitId}`, {
        method: isLiked ? "DELETE" : "PUT",
      }).then(() => !isLiked),
  });

  const liked = currentlyLiked === undefined ? initiallyLiked : currentlyLiked;
  const likesCount =
    currentlyLiked === undefined || currentlyLiked === initiallyLiked
      ? initialLikesCount
      : currentlyLiked
      ? initialLikesCount + 1
      : initialLikesCount - 1;

  return (
    <div
      className={`flex gap-1 ${liked ? "text-primary" : "text-default-300"}`}
      {...props}
    >
      {liking ? (
        <LoadingNoggles className="w-[32px]" />
      ) : (
        <BlinkingNoggles
          onClick={() => liked !== undefined && toggleLike(liked)}
          className={`w-[32px] cursor-pointer hover:${
            liked ? "text-default-200" : "text-primary"
          }`}
        />
      )}
      <small className="text-sm">{likesCount}</small>
    </div>
  );
};
