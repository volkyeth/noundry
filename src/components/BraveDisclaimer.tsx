import { Image, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Text, VStack } from "@chakra-ui/react";
import disableAnimation from "../assets/brave-disable-shield.gif";

export const BraveDisclaimer = () => {
  const hasBraveGlitch = useDetectBraveGlitch();
  return (
    <Modal isOpen={hasBraveGlitch} isCentered onClose={() => {}} size={"6xl"}>
      <ModalOverlay bgColor={"blackAlpha.800"} />
      <ModalContent bgColor={"gray.900"} borderRadius={0} p={10}>
        <ModalHeader>Brave Browser warning 🦁</ModalHeader>
        <ModalBody>
          <VStack fontSize={"md"} spacing={6} py={10}>
            <Text>
              Brave browser has anti-figerprinting features that add noise to the page canvas to prevent some user identification techniques, and that
              breaks Noundry Studio
            </Text>
            <Text>To use it on Brave you have to disable the Shields for this page</Text>
            <Image src={disableAnimation} />
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

// ref: https://github.com/brave/brave-browser/issues/10000#issue-627131092
const useDetectBraveGlitch = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;
  // Set the color to pure white and draw a rectangle filling the entire canvas
  ctx.fillStyle = "rgba(255, 255, 255, 1)";
  ctx.fillRect(0, 0, 1024, 1024);
  // Get the image data from the canvas
  let imageData = ctx.getImageData(0, 0, 1024, 1024);
  // Go through every RGBA value of every pixel and detect glitch if it is not pure white
  for (const pixel of imageData.data) {
    if (pixel != 255) {
      return true;
    }
  }

  return false;
};
