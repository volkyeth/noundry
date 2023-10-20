import { useMainnetArtwork } from "@/hooks/useMainnetArtwork";
import { NounTraits } from "@/types/noun";
import { traitCategory } from "@/utils/traits/categories";
import { formatTraitType } from "@/utils/traits/format";
import {
  Button,
  ButtonProps,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import { TraitType } from "noggles";
import { FC } from "react";
import { twMerge } from "tailwind-merge";
import Dynamic from "./Dynamic";
import { Hoverable } from "./Hoverable";
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

  return (
    <Dynamic>
      <Button
        isIconOnly
        {...props}
        className={classNames?.button}
        onClick={onOpen}
        isDisabled={!mainnetArtwork}
      >
        <TraitIcon
          type={traitType}
          className={twMerge("w-[16px]", classNames?.icon)}
        />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          <ModalBody className="p-0">
            {traits && (
              <VirtualizedGallery
                className="h-[600px] w-full p-0"
                itemCount={traits.length}
                itemSize={128 + 2 * 4}
                scrollContainerPadding={4}
                header={
                  <h2 className="self-center pb-2 font-bold">{`Pick the ${formatTraitType(
                    traitType
                  )}`}</h2>
                }
              >
                {(virtualItem) => (
                  <Hoverable key={virtualItem.key} isDisabled={!onPick}>
                    {({ isHovered, onMouseEnter, onMouseLeave }) => {
                      return (
                        <div
                          style={{
                            padding: "4px",
                            backgroundColor: isHovered
                              ? "lab(var(--nextui-primary))"
                              : undefined,
                          }}
                          {...{ onMouseEnter, onMouseLeave }}
                          onClick={() => {
                            onPick?.(virtualItem.index);
                            onClose();
                          }}
                        >
                          <Noun
                            size={128}
                            {...{
                              ...currentTraits,
                              [traitType]: traits[virtualItem.index],
                            }}
                          />
                        </div>
                      );
                    }}
                  </Hoverable>
                )}
              </VirtualizedGallery>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Dynamic>
  );
};
