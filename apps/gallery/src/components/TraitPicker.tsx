import { useMainnetArtwork } from "@/hooks/useMainnetArtwork";
import { NounTraits } from "@/types/noun";
import { traitCategory } from "@/utils/traits/categories";
import { formatTraitType } from "@/utils/traits/format";
import {
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import { TraitType } from "noggles";
import { FC } from "react";
import { twMerge } from "tailwind-merge";
import { useMediaQuery } from "usehooks-ts";
import { Button, ButtonProps } from "./Button";
import Dynamic from "./Dynamic";
import { Noun } from "./Noun";
import { TraitIcon } from "./TraitIcon";
import { VirtualizedGallery } from "./VirtualizedGallery";

export interface TraitPickerProps extends ButtonProps {
  traitType: TraitType;
  currentTraits: NounTraits;
  classNames?: { button?: string; icon?: string };
  onPick?: (traitId: number) => void;
}

export const TraitPicker: FC<TraitPickerProps> = ({
  traitType,
  currentTraits,
  onPick,
  classNames,
  ...props
}) => {
  const { data: mainnetArtwork } = useMainnetArtwork();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const traits = mainnetArtwork?.[traitCategory(traitType)];
  const lanes = useMediaQuery("(max-width: 768px)") ? 2 : 3;

  return (
    <Dynamic>
      <Button
        {...props}
        className={classNames?.button}
        onClick={onOpen}
        isDisabled={!mainnetArtwork}
      >
        <TraitIcon
          type={traitType}
          negative
          className={twMerge("w-[16px]", classNames?.icon)}
        />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent className="w-fit">
          <ModalBody className="p-0">
            {traits && (
              <VirtualizedGallery
                direction="vertical"
                hoverable={!!onPick}
                className="max-h-[80vh] w-full p-0"
                itemCount={traits.length}
                itemSize={128 + 2 * 4}
                lanes={lanes}
                scrollContainerPadding={4}
                header={
                  <h2 className="self-center pb-2 font-bold">{`Pick the ${formatTraitType(
                    traitType
                  )}`}</h2>
                }
              >
                {(virtualItem) => (
                  <Noun
                    onClick={() => {
                      onPick?.(virtualItem.index);
                      onClose();
                    }}
                    size={128}
                    {...{
                      ...currentTraits,
                      [traitType]: traits[virtualItem.index],
                    }}
                  />
                )}
              </VirtualizedGallery>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Dynamic>
  );
};
