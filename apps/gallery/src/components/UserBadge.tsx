import { shortAddress } from "@/utils/address/format";
import { FC } from "react";
import Dynamic from "./Dynamic";
import { UserAvatar } from "./UserAvatar";
import { UserInfo } from "@/types/user";
import { useUserInfo } from "@/hooks/useUserInfo";
import { cn } from "@/utils/cn";

export interface UserBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  address: `0x${string}`;
  userInfo?: UserInfo;
  classNames?: {
    avatar?: string;
    username?: string;
  };
}

export const UserBadge: FC<UserBadgeProps> = ({
  address,
  userInfo,
  className,
  classNames,
  ...props
}) => {
  // Fallback to hook if userInfo is not provided (backward compatibility)
  const { data: hookUserInfo } = useUserInfo(userInfo ? undefined : address);
  const finalUserInfo = userInfo || hookUserInfo || undefined;
  const username = finalUserInfo?.userName || shortAddress(address);

  return (
    <Dynamic>
      <div
        className={cn("flex flex-row items-center gap-2 ", className)}
        {...props}
      >
        <UserAvatar address={address} userInfo={finalUserInfo} className={classNames?.avatar} />
        <p
          className={cn(
            "font-bold text-secondary text-sm flex-shrink text-ellipsis whitespace-nowrap max-w-10 overflow-clip",
            classNames?.username,
          )}
        >
          {username}
        </p>
      </div>
    </Dynamic>
  );
};
