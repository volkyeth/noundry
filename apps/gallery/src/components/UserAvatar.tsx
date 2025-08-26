import { FC } from "react";
import { UserInfo } from "@/types/user";
import { useUserInfo } from "@/hooks/useUserInfo";
import { DEFAULT_PROFILE_PICTURE } from "@/constants/config";
import { cn } from "@/utils/cn";

export interface UserAvatarProps extends React.HTMLAttributes<HTMLImageElement> {
  address?: `0x${string}`;
  userInfo?: UserInfo;
}

export const UserAvatar: FC<UserAvatarProps> = ({ address, userInfo, className, ...props }) => {
  // Fallback to hook if userInfo is not provided (backward compatibility)
  const { data: hookUserInfo } = useUserInfo(userInfo ? undefined : address);
  const finalUserInfo = userInfo || hookUserInfo;

  return (
    <img
      className={cn(
        "w-8 h-8 border-2 border-content1 box-content p-0 bg-warm flex-shrink-0 object-cover",
        className,
      )}
      src={finalUserInfo?.profilePic || DEFAULT_PROFILE_PICTURE}
      alt="User avatar"
      {...props}
    />
  );
};
