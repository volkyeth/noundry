import NounIcon from "@/assets/traitIcons/nouns.svg";
import { useMainnetArtwork } from "@/hooks/useMainnetArtwork";
import {
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import { EncodedTrait, NounSeed, TraitType } from "noggles";
import { FC } from "react";
import { twMerge } from "tailwind-merge";
import { Button, ButtonProps } from "./Button";
import Dynamic from "./Dynamic";
import { TraitTestingGrounds } from "./TraitTestGrounds";

export interface ModelPickerProps extends ButtonProps {
  traitType: TraitType;
  trait: EncodedTrait | ImageBitmap;
  classNames?: { button?: string; icon?: string };
  onPick?: (seed: NounSeed) => void;
}

export const ModelPicker: FC<ModelPickerProps> = ({
  traitType,
  trait,
  onPick,
  classNames,
  ...props
}) => {
  const { data: mainnetArtwork } = useMainnetArtwork();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <Dynamic>
      <Button
        {...props}
        className={classNames?.button}
        onClick={onOpen}
        isDisabled={!mainnetArtwork}
      >
        <NounIcon className={twMerge("w-[32px]", classNames?.icon)} />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          <ModalBody className="p-0">
            <TraitTestingGrounds
              header={
                <h2 className="self-center pb-2 font-bold">Pick a model</h2>
              }
              trait={trait}
              traitType={traitType}
              className="h-[600px] w-full p-0"
              onNounClick={(seed) => {
                onPick?.(seed);
                onClose();
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Dynamic>
  );
};
