import { useUserInfo } from "@/hooks/useUserInfo";
import { useModal } from "connectkit";
import { useAccount } from "wagmi";
import { Button } from "./Button";
import Dynamic from "./Dynamic";
import { RiLogoutBoxLine, RiLoginBoxLine } from 'react-icons/ri';

export const ConnectButton = () => {
  const { address } = useAccount();
  const { openProfile } = useModal();
  const { data: userInfo } = useUserInfo(address);

  return (
<Dynamic>
  <Button
    variant="white"
    className={`p-[2px] min-h-unit-10 min-w-unit-24 ${
      userInfo && address ? '' : 'px-5 pl-4 '
    }`}
    onClick={openProfile}
  >
    {userInfo && address ? (
      <div className="flex flex-row gap-2 pl-3 pr-5 items-center">
        {/* <UserAvatar address={address} /> */}
        <RiLogoutBoxLine className="text-2xl" /> {/* Connected state icon */}
        <p className="">{userInfo.userName}</p>
      </div>
    ) : (
      <div className="flex flex-row gap-2 items-center">
        <RiLoginBoxLine className="text-2xl"/> {/* Connect state icon */}
        Connect
      </div>
    )}
  </Button>
</Dynamic>
  );
  
};
