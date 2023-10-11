import { useUserInfo } from "@/hooks/useUserInfo";
import { shortAddress } from "@/utils/address/format";
import { Avatar } from "@nextui-org/react";
import dummyImg from "public/dummyImg.png";
import { FC } from "react";
import { useEnsAvatar, useEnsName } from "wagmi";
import Dynamic from "./Dynamic";

export interface SmallAccountBadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  address: `0x${string}`;
}

export const SmallAccountBadge: FC<SmallAccountBadgeProps> = ({
  address,
  ...props
}) => {
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName });
  const { data: userInfo } = useUserInfo(address);

  const avatar = userInfo?.profilePic || ensAvatar || dummyImg.src;
  const username = userInfo?.userName || ensName || shortAddress(address);

  return (
    <Dynamic>
      <div className="flex flex-row items-center gap-2" {...props}>
        <Avatar className="w-8 h-8 p-0" src={avatar} />
        <p className="font-semibold">{username}</p>
      </div>
    </Dynamic>
  );
};
