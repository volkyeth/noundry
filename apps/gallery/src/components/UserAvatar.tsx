import { useUserInfo } from "@/hooks/useUserInfo";
import { Avatar, AvatarProps, cn } from "@nextui-org/react";
import { FC } from "react";
import Dynamic from "./Dynamic";

export interface UserAvatarProps extends AvatarProps {
  address?: `0x${string}`;
}

export const UserAvatar: FC<UserAvatarProps> = ({ address, ...props }) => {
  const { data: userInfo } = useUserInfo(address);

  return (
    <Dynamic>
      <Avatar
        radius="none"
        className={cn(
          "w-8 h-8 border-2 border-content1 box-content p-0 bg-warm flex-shrink-0",
          props.className,
        )}
        src={userInfo?.profilePic}
        {...props}
      />
    </Dynamic>
  );
};
