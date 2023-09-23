import { useEffect } from "react";
import ClickAwayListener from "react-click-away-listener";
const ErrorBanner = ({ isErrorBanner, setIsErrorBanner, message }) => {
  useEffect(() => {
    if (isErrorBanner) {
      const timeout = setTimeout(() => {
        setIsErrorBanner(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [isErrorBanner]);

  return (
    <ClickAwayListener onClickAway={() => setIsErrorBanner(false)}>
      <div
        className={`text-black fixed top-0 left-0 flex justify-center items-center z-[1055]  h-full w-full overflow-y-hidden overflow-x-hidden outline-none`}
        id="exampleModalLg"
        aria-labelledby="exampleModalLgLabel"
        aria-modal="true"
        role="dialog"
      >
        <div className="pointer-events-auto relative flex container h-fit p-20 text-center text-xl font-bold flex-col rounded-lg border-2 border-[#4A5568] bg-white text-black bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600">
          {message}
        </div>
      </div>
    </ClickAwayListener>
  );
};

export default ErrorBanner;
