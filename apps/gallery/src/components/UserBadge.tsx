import { useUserInfo } from "@/hooks/useUserInfo";
import { shortAddress } from "@/utils/address/format";
import { FC } from "react";
import Dynamic from "./Dynamic";
import { UserAvatar } from "./UserAvatar";
import { cn } from "@nextui-org/react";

export interface UserBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  address: `0x${string}`;
  classNames?: {
    avatar?: string;
    username?: string;
  };
}

export const UserBadge: FC<UserBadgeProps> = ({
  address,
  className,
  classNames,
  ...props
}) => {
  const { data: userInfo } = useUserInfo(address);
  const username = userInfo?.userName || shortAddress(address);

  return (
    <Dynamic>
      <div
        className={cn("flex flex-row items-center gap-2 ", className)}
        {...props}
      >
        <UserAvatar address={address} className={classNames?.avatar} />
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
