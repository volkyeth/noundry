import { useEffect, useState } from "react";
import ClickAwayListener from "react-click-away-listener";

const BannerModal = ({ setIsModalOpenBanner, className }) => {
  const [msg, setMsg] = useState("");
  const messages = [
    "What a nice bunch of pixels, thank you ser",
    "Much wow!",
    "Very nounish, thank you!",
    "Ooof! Now THAT is pixel art!",
    "So fresh and so clean!",
    "Nounishness at its finest!",
    "A masterpiece in pixel form!",
    "You can turn pixels into ETH ser!",
    "That's some fine pixels right there!",
    "What a beauty. Thank you ser!",
    "Such pixel wizardry!",
    "This is a nounish masterclass!",
    "Your creations are amazing, ser!",
    "Oooof!! Wen mint?",
    "Pixel craftsmanship like yours is a rare thing.",
    "Wow! Im going to have to right click save this.",
    "This one hits different.",
    "Looks like Eboy could have drawn this one. Well done",
    "LFG!!",
  ];
  useEffect(() => {
    setMsg(messages[Math.floor(Math.random() * messages.length)]);
  }, []);
  return (
    <ClickAwayListener onClickAway={() => setIsModalOpenBanner(false)}>
      <div
        className={`${className} my-auto flex gap-4 font-Pix container h-fit p-8 py-20 text-center font-bold flex-col rounded-lg border-1 border-[#4A5568] bg-white text-black bg-clip-padding text-current shadow-lg dark:bg-off-dark`}
      >
        {msg}
        <div className="flex items-center justify-center mt-6">
          <button
            onClick={() => {
              setIsModalOpenBanner(false);
            }}
            className="flex justify-center bg-light dark:bg-dark rounded-md items-center mt-6 align-middle p-1 px-8 border-1 border-[#4A5568]"
          >
            Done
          </button>
        </div>
      </div>
    </ClickAwayListener>
  );
};

export default BannerModal;
