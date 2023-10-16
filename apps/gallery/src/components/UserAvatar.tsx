import { useUserInfo } from "@/hooks/useUserInfo";
import { Avatar, AvatarProps } from "@nextui-org/react";
import dummyImg from "public/dummyImg.png";
import { FC } from "react";
import { useEnsAvatar, useEnsName } from "wagmi";
import Dynamic from "./Dynamic";

export interface UserAvatarProps extends AvatarProps {
  address?: `0x${string}`;
}

export const UserAvatar: FC<UserAvatarProps> = ({ address, ...props }) => {
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName });
  const { data: userInfo } = useUserInfo(address);

  const avatar = userInfo?.profilePic || ensAvatar || dummyImg.src;

  return (
    <Dynamic>
      <Avatar
        radius="none"
        className="w-8 h-8 border-2 border-content1 box-content p-0 bg-warm"
        src={avatar}
        {...props}
      />
    </Dynamic>
  );
};
