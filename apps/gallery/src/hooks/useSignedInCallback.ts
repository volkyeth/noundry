import { useModal, useSIWE } from "connectkit";
import { DependencyList, useCallback } from "react";

export const useSignedInCallback = (callback: any, deps: DependencyList) => {
  const { openSIWE } = useModal();
  const { isSignedIn } = useSIWE();

  return useCallback(() => {
    if (isSignedIn) {
      callback();
    } else {
      openSIWE();
    }
  }, [isSignedIn, ...deps]);
};
