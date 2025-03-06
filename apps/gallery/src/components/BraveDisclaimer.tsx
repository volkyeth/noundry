"use client";

import disableAnimation from "@/assets/brave-shield-disclaimer.gif";
import {
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

export const BraveDisclaimer = () => {
  const hasBraveGlitch = useDetectBraveGlitch();
  return (
    <Modal isOpen={hasBraveGlitch} hideCloseButton>
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">
            Brave Browser warning 🦁
          </ModalHeader>
          <ModalBody>
            <p>
              Brave browser has anti-fingerprinting features that interfere with
              some Noundry Gallery functionality. To submit or propose traits on
              Brave you have to disable the Shields for this site.
            </p>

            <Image
              src={disableAnimation.src}
              alt="Instructions to disable Brave Shields"
            />
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  );
};

// ref: https://github.com/brave/brave-browser/issues/10000#issue-627131092
const useDetectBraveGlitch = () => {
  const [hasGlitch, setHasGlitch] = useState(false);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d")!;
    // Set the color to pure white and draw a rectangle filling the entire canvas
    ctx.strokeText("Hello World", 10, 50);
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fillRect(0, 0, 1024, 1024);
    // Get the image data from the canvas
    canvas.toDataURL();
    let imageData = ctx.getImageData(0, 0, 1024, 1024);
    // Go through every RGBA value of every pixel and detect glitch if it is not pure white
    for (const pixel of imageData.data) {
      if (pixel != 255) {
        setHasGlitch(true);
        return;
      }
    }

    setHasGlitch(false);
  }, []);

  return hasGlitch;
};
