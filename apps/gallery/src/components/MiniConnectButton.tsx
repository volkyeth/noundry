import { Button } from "@nextui-org/react";
import { useModal } from "connectkit";
import { BiWallet } from "react-icons/bi";
import { useAccount } from "wagmi";
import Dynamic from "./Dynamic";
import { UserAvatar } from "./UserAvatar";

export const MiniConnectButton = () => {
  const { address } = useAccount();
  const { openProfile } = useModal();

  if (!address) {
    return (
      <Dynamic>
        <Button
          radius="none"
          disableRipple
          className="h-[40px] p-2 min-w-0   bg-content1"
          onClick={openProfile}
        >
          <BiWallet className="w-6 h-6 " />
        </Button>
      </Dynamic>
    );
  }

  return (
    <Dynamic>
      <Button
        radius="none"
        className="h-fit p-0 w-fit min-w-0 bg-content1 border-2"
        disableRipple
        onClick={openProfile}
      >
        <div className="p-[2px]">
          <UserAvatar address={address} className="bg-warm w-8 h-8" />
        </div>
      </Button>
    </Dynamic>
  );
};
