import { useUserInfo } from "@/hooks/useUserInfo";
import { Button } from "@nextui-org/react";
import { useModal } from "connectkit";
import { useAccount } from "wagmi";
import Dynamic from "./Dynamic";
import { UserAvatar } from "./UserAvatar";

export const ConnectButton = () => {
  const { address } = useAccount();
  const { openProfile } = useModal();
  const { data: userInfo } = useUserInfo(address);

  if (!address || !userInfo) {
    return (
      <Dynamic>
        <Button
          radius="none"
          disableRipple
          className="h-[40px] px-10   bg-content1"
          onClick={openProfile}
        >
          Connect
        </Button>
      </Dynamic>
    );
  }

  return (
    <Dynamic>
      <Button
        radius="none"
        className="h-fit p-0 w-fit bg-content1"
        disableRipple
        onClick={openProfile}
      >
        <Dynamic>
          <div className="flex flex-row gap-8 p-[2px] pr-8 items-center ">
            <UserAvatar address={address} />
            <p className="">{userInfo.userName}</p>
          </div>
        </Dynamic>
      </Button>
    </Dynamic>
  );
};
