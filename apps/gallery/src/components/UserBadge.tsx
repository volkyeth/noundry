import { useUserInfo } from "@/hooks/useUserInfo";
import { shortAddress } from "@/utils/address/format";
import { FC } from "react";
import { useEnsName } from "wagmi";
import Dynamic from "./Dynamic";
import { UserAvatar } from "./UserAvatar";

export interface UserBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  address: `0x${string}`;
}

export const UserBadge: FC<UserBadgeProps> = ({ address, ...props }) => {
  const { data: ensName } = useEnsName({ address });
  const { data: userInfo } = useUserInfo(address);
  const username = userInfo?.userName || ensName || shortAddress(address);

  return (
    <Dynamic>
      <div className="flex flex-row items-center gap-2 " {...props}>
        <UserAvatar address={address} />
        <p className="font-semibold">{username}</p>
      </div>
    </Dynamic>
  );
};
