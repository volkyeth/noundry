import { useIsFetching } from "@tanstack/react-query";
import LoadingNoggles from "public/loading-noggles.svg";
import { BlinkingNoggles } from "./BlinkingNoggles";

const Footer = () => {
  const isFetching = useIsFetching() > 0;
  return (
    <div className="w-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="h-16 md:h-24 w-full"
      >
        <path
          fill="#FBCB07"
          fill-opacity="1"
          d="M0,160L40,176C80,192,160,224,240,218.7C320,213,400,171,480,170.7C560,171,640,213,720,197.3C800,181,880,107,960,101.3C1040,96,1120,160,1200,176C1280,192,1360,160,1400,144L1440,128L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
        ></path>
      </svg>
      <div className="w-full bg-brand-yellow pb-10 flex flex-col items-center gap-2 text-secondary">
        {isFetching ? (
          <LoadingNoggles className="w-[64px]" />
        ) : (
          <BlinkingNoggles className="w-[64px] h-[24px] shrink-0 " />
        )}

        <p className="text-xl font-semibold ">Yellow & Based</p>
      </div>
    </div>
  );
};

export default Footer;
