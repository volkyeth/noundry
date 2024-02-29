import { useUserInfo } from "@/hooks/useUserInfo";
import { useModal } from "connectkit";
import { useAccount } from "wagmi";
import { Button } from "./Button";
import Dynamic from "./Dynamic";
import { UserAvatar } from "./UserAvatar";

export const ConnectButton = () => {
  const { address } = useAccount();
  const { openProfile } = useModal();
  const { data: userInfo } = useUserInfo(address);

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
