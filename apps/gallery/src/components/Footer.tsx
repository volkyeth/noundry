import LoadingNoggles from "@/assets/loading-noggles.svg";
import { useIsFetching } from "@tanstack/react-query";
import { BlinkingNoggles } from "./BlinkingNoggles";

const Footer = () => {
  const isFetching = useIsFetching() > 0;
  return (
    <div className="w-full py-10 flex flex-col items-center gap-2">
      {isFetching ? (
        <LoadingNoggles className="w-[64px] text-default-300" />
      ) : (
        <BlinkingNoggles className="w-[64px] h-[24px] shrink-0 text-default-300" />
      )}

      <p className="text-xl font-semibold text-default-300">A Nouns thing</p>
    </div>
  );
};

export default Footer;
