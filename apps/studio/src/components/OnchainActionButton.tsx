import { Button, ButtonProps } from "@chakra-ui/react";
import { ConnectKitButton, useModal } from "connectkit";
import { FC } from "react";

export interface OnchainActionButtonProps extends ButtonProps {
  disconnectedText?: string;
  wrongNetworkText?: string;
}

export const OnchainActionButton: FC<OnchainActionButtonProps> = ({
  children,
  isDisabled,
  disconnectedText = "Connect Wallet",
  wrongNetworkText = "Switch Network",
  ...props
}) => {
  const { openSwitchNetworks } = useModal();
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, unsupported, show }) => {
        if (!isConnected) {
          return (
            <Button {...props} onClick={show}>
              {disconnectedText}
            </Button>
          );
        }

        if (unsupported) {
          return (
            <Button {...props} onClick={openSwitchNetworks}>
              {wrongNetworkText}
            </Button>
          );
        }

        return (
          <Button {...props} isDisabled={isDisabled}>
            {children}
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};
