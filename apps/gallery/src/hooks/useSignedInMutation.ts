import {
  UseMutationOptions,
  UseMutationResult,
  useMutation,
} from "@tanstack/react-query";
import { useModal, useSIWE } from "connectkit";

export const useSignedInMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> => {
  const { isSignedIn } = useSIWE();
  const { openSIWE } = useModal();
  const mutation = useMutation(options);

  console.log({ isSignedIn });

  return {
    ...mutation,
    mutate: isSignedIn ? mutation.mutate : () => openSIWE(),
    mutateAsync: isSignedIn ? mutation.mutateAsync : async () => openSIWE(),
  } as typeof mutation;
};
