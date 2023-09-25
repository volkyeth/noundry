import { PropsOf } from "@nextui-org/react";
import { ConnectKitProvider } from "connectkit";
import { useTheme } from "next-themes";
import { FC } from "react";

export const ThemedConnectKitProvider: FC<
  PropsOf<typeof ConnectKitProvider>
> = (props) => {
  const { theme } = useTheme();
  const mode = (theme as "light" | "dark" | undefined) ?? "dark";
  return (
    <ConnectKitProvider
      mode={mode}
      customTheme={{
        "--ck-connectbutton-border-radius": "6px",
        "--ck-connectbutton-box-shadow": `inset 0 0 0 1px ${
          mode === "dark" ? "#4a5568" : "#4a5568"
        }`,
        "--ck-connectbutton-background":
          mode === "dark" ? "#24272f" : "#f5f5f5",
        "--ck-connectbutton-font-size": "16px",
        "--ck-font-family": '"Roboto Flex", sans-serif',
      }}
      {...props}
    />
  );
};
