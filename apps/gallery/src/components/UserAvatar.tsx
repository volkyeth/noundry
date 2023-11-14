import { DEFAULT_PROFILE_PICTURE } from "@/constants/config";
import { useUserInfo } from "@/hooks/useUserInfo";
import { Avatar, AvatarProps } from "@nextui-org/react";
import { FC } from "react";
import { useEnsAvatar, useEnsName } from "wagmi";
import Dynamic from "./Dynamic";

export interface UserAvatarProps extends AvatarProps {
  address?: `0x${string}`;
}

export const UserAvatar: FC<UserAvatarProps> = ({ address, ...props }) => {
  const { data: userInfo } = useUserInfo(address);
  const { data: ensName } = useEnsName({
    address,
    enabled: !userInfo?.profilePic,
  });
  const { data: ensAvatar } = useEnsAvatar({
    name: ensName,
    enabled: !userInfo?.profilePic,
  });

  const avatar = userInfo?.profilePic || ensAvatar || DEFAULT_PROFILE_PICTURE;

  return (
    <Dynamic>
      <Avatar
        radius="none"
        className="w-8 h-8 border-2 border-content1 box-content p-0 bg-warm flex-shrink-0"
        src={avatar}
        {...props}
      />
    </Dynamic>
  );
};
