import { CordProvider } from "@cord-sdk/react";
import { useQuery } from "@tanstack/react-query";
import { useSIWE } from "connectkit";
import { FC, PropsWithChildren } from "react";

export const SiweCordProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data: siweCredentials } = useSIWE();
  const { data: clientAuthToken } = useQuery({
    queryKey: ["cord-token", siweCredentials],
    queryFn: () => fetch(`/api/cord`).then((r) => r.json()),
  });

  return (
    <CordProvider
      enableSlack={false}
      enableTasks={false}
      clientAuthToken={clientAuthToken ?? null}
    >
      {children}
    </CordProvider>
  );
};
