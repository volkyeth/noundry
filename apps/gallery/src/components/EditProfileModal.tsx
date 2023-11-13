import { DEFAULT_PROFILE_PICTURE } from "@/constants/config";
import { useSignedInMutation } from "@/hooks/useSignedInMutation";
import { usernameSchema } from "@/schemas/common";
import { UserInfo } from "@/types/user";
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { RiPencilFill } from "react-icons/ri";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";
import { Button } from "./Button";

export interface EditProfileModalProps {
  isOpen: boolean;
  onOpenChange;
  currentUserInfo: UserInfo;
}

export const EditProfileModal: FC<EditProfileModalProps> = ({
  isOpen,
  onOpenChange,
  currentUserInfo,
}) => {
  const [profilePic, setProfilePic] = useState(currentUserInfo.profilePic);
  const [userName, setUserName] = useState(currentUserInfo.userName);
  const [twitter, setTwitter] = useState(currentUserInfo.twitter);
  const [farcaster, setFarcaster] = useState(currentUserInfo.farcaster);
  const [about, setAbout] = useState(currentUserInfo.about);
  const [isUSernameInvalid, setIsUsernameInvalid] = useState(false);

  useEffect(() => {
    setIsUsernameInvalid(
      userName !== "" && usernameSchema.safeParse(userName).success === false
    );
  }, [userName]);

  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName });

  const {
    mutateAsync: updateUser,
    isLoading,
    reset: resetErrors,
    data: result,
  } = useSignedInMutation({
    mutationFn: () =>
      fetch(`/api/user/${address}/info`, {
        method: "PUT",
        body: JSON.stringify(
          {
            profilePic: profilePic || undefined,
            userName: userName || undefined,
            about: about || undefined,
            farcaster: farcaster || undefined,
            twitter: twitter || undefined,
          },
          null,
          2
        ),
      }).then(async (r) => ({
        status: r.status,
        errorMessage: await r.json().then((j) => j?.error),
        success: r.ok,
      })),
  });

  const reset = useCallback(() => {
    setProfilePic(currentUserInfo.profilePic);
    setUserName(currentUserInfo.userName);
    setTwitter(currentUserInfo.twitter);
    setFarcaster(currentUserInfo.farcaster);
    setAbout(currentUserInfo.about);
    resetErrors();
  }, [isOpen, currentUserInfo]);

  useEffect(reset, [isOpen, currentUserInfo]);

  const { reload } = useRouter();

  const { getInputProps, getRootProps } = useDropzone({
    accept: { "image/png": [".png"] },
    maxFiles: 1,
    multiple: false,
    onDropAccepted: ([file]) => {
      const reader = new FileReader();
      reader.onload = function () {
        const img = new Image();
        const canvas = document.createElement("canvas");
        canvas.width = 128;
        canvas.height = 128;
        img.onload = () => {
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setProfilePic(canvas.toDataURL("png"));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    },
  });

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Update profile
            </ModalHeader>
            <ModalBody className="flex flex-col gap-4">
              <div className="flex flex-col text-xs font-medium text-foreground-600">
                <p>Profile picture</p>
                <div className="flex gap-2 items-end">
                  <img
                    src={profilePic ?? ensAvatar ?? DEFAULT_PROFILE_PICTURE}
                    className="w-24 h-24  box-content border-content1 shrink-0 bg-warm"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      className="h-1/2"
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      <RiPencilFill className="w-[24px] h-[24px]" />
                    </Button>
                    {profilePic && (
                      <Button
                        variant="ghost"
                        onClick={() => setProfilePic(undefined)}
                      >
                        <svg
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M16 2v4h6v2h-2v14H4V8H2V6h6V2h8zm-2 2h-4v2h4V4zm0 4H6v12h12V8h-4zm-5 2h2v8H9v-8zm6 0h-2v8h2v-8z"
                            fill="currentColor"
                          />{" "}
                        </svg>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <Input
                variant="flat"
                label="Username"
                value={userName}
                placeholder={ensName ?? undefined}
                isInvalid={isUSernameInvalid}
                description={"Can only include letters, numbers and dashes"}
                onChange={(e) => setUserName(e.target.value)}
                maxLength={15}
                className="w-full"
              />
              <Textarea
                variant="flat"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                label="About"
                placeholder="Some words about you"
                className="w-full"
                maxRows={5}
                maxLength={500}
              />
              <Input
                variant="flat"
                label="Twitter username"
                description={
                  twitter ? `https://www.twitter.com/${twitter}` : ""
                }
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                maxLength={15}
              />
              <Input
                variant="flat"
                label="Farcaster username"
                value={farcaster}
                description={
                  farcaster ? `https://warpcast.com/${farcaster}` : ""
                }
                onChange={(e) => setFarcaster(e.target.value)}
                className="w-full"
              />
              {result?.errorMessage && (
                <p className="text-red-500 text-sm">{result.errorMessage}</p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                isDisabled={isUSernameInvalid}
                isLoading={isLoading}
                loadingContent="Saving"
                onClick={() =>
                  updateUser().then((r) => {
                    if (r.success) {
                      onClose();
                      reload();
                    }
                  })
                }
              >
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
