import { useUserInfo } from "@/hooks/useUserInfo";
import { useModal } from "connectkit";
import { useEffect, useMemo } from "react";
import { mainnet } from "viem/chains";
import { useAccount } from "wagmi";
import { Button } from "./Button";
import Dynamic from "./Dynamic";
import { UserAvatar } from "./UserAvatar";

export const ConnectButton = () => {
  const { address } = useAccount();
  const { openProfile, openSwitchNetworks, open } = useModal();
  const { data: userInfo } = useUserInfo(address);
  const { chainId } = useAccount();
  const unsupported = useMemo(() => {
    return chainId !== mainnet.id;
  }, [chainId]);

  useEffect(() => {
    if (open && unsupported) {
      openSwitchNetworks();
    }
  }, [open, unsupported, openSwitchNetworks]);

  return (
    <Dynamic>
      <Button
        variant="white"
        className="p-[2px] min-h-unit-10 min-w-unit-24"
        onClick={openProfile}
      >
        {userInfo && address ? (
          <div className="flex flex-row gap-6  pr-6 items-center  ">
            <UserAvatar address={address} />
            <p className="">{userInfo.userName}</p>
          </div>
        ) : (
          "Connect"
        )}
      </Button>
    </Dynamic>
  );
};
