"use client";

import FarcasterIcon from "@/assets/icons/farcaster.svg";
import { Button } from "@/components/Button";
import Dynamic from "@/components/Dynamic";
import { EditProfileModal } from "@/components/EditProfileModal";
import { Gallery } from "@/components/Gallery";
import { UserAvatar } from "@/components/UserAvatar";
import { UserInfo } from "@/types/user";
import { useDisclosure } from "@nextui-org/react";
import { FC } from "react";
import { FaTwitter } from "react-icons/fa6";
import { RiPencilFill } from "react-icons/ri";
import { useAccount } from "wagmi";

export interface ProfileProps {
  userInfo: UserInfo;
}

const Profile: FC<ProfileProps> = ({ userInfo }) => {
  const { address } = useAccount();
  const isOwner = address?.toLowerCase() === userInfo.address?.toLowerCase();

  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  return (
    <>
      <div className="container flex flex-col px-8 self-center my-12 mx-auto gap-16">
        <div className="flex flex-col gap-4 items-start text-xl ">
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 items-end">
              <UserAvatar
                address={userInfo.address}
                className="w-24 h-24 border-8 box-content border-content1 shrink-0 bg-warm"
              />
              <div className="flex flex-col gap-2">
                <Dynamic>
                  {isOwner && (
                    <>
                      <EditProfileModal
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                        currentUserInfo={userInfo}
                      />
                      <Button
                        onClick={onOpen}
                        variant="primary"
                        className="flex gap-1 text-sm px-4 items-center"
                      >
                        Edit
                        <RiPencilFill className="" />
                      </Button>
                    </>
                  )}
                </Dynamic>
                <div className="flex text-secondary text-xl gap-2">
                  {userInfo?.twitter && (
                    <a
                      href={`https://twitter.com/${userInfo.twitter}`}
                      target="_blank"
                    >
                      <FaTwitter />
                    </a>
                  )}
                  {userInfo?.farcaster && (
                    <a
                      href={`https://warpcast.com/${userInfo.farcaster}`}
                      target="_blank"
                    >
                      <FarcasterIcon />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <h1 className="text-xl  xs:text-3xl font-Inter mt-0">
              {userInfo.userName.toLowerCase()}
            </h1>
          </div>
          <p className="text-sm xs:text-medium max-w-2xl w-full whitespace-pre-line mt-2">
            {userInfo.about}
          </p>
        </div>
        <div>
          <h2 className="text-2xl text-default-400">User traits</h2>
          <Gallery creator={userInfo.address} />
        </div>
        <div>
          <h2 className="text-2xl text-default-400">User favorites</h2>
          <Gallery likedBy={userInfo.address} />
        </div>
      </div>
    </>
  );
};

export default Profile;
