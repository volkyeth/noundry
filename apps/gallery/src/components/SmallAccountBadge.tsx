import { shortAddress } from "@/utils/address/format";
import { Avatar } from "@nextui-org/react";
import dummyImg from "public/dummyImg.png";
import { FC } from "react";
import { useEnsAvatar, useEnsName } from "wagmi";

export interface SmallAccountBadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  address: `0x${string}`;
}

export const SmallAccountBadge: FC<SmallAccountBadgeProps> = ({
  address,
  ...props
}) => {
  const { data: name } = useEnsName({ address });
  const { data: avatar } = useEnsAvatar({ name: name });

  return (
    <div className="flex flex-row items-center gap-2" {...props}>
      <Avatar className="w-8 h-8 p-0" src={avatar || dummyImg.src} />
      <p>{name || shortAddress(address)}</p>
    </div>
  );
};
