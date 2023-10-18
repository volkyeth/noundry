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
import Dynamic from "./Dynamic";
import { Hoverable } from "./Hoverable";
import { Noun } from "./Noun";
import { TraitIcon } from "./TraitIcon";
import { VirtualizedGallery } from "./VirtualizedGallery";

export interface TraitPickerProps extends ButtonProps {
  traitType: TraitType;
  currentTraits: NounTraits;
  onPick?: (newTraits: NounTraits) => void;
}

export const TraitPicker: FC<TraitPickerProps> = ({
  traitType,
  currentTraits,
  onPick,
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
        onClick={onOpen}
        isDisabled={!mainnetArtwork}
      >
        <TraitIcon type={traitType} />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalBody className="px-2">
            {traits && (
              <VirtualizedGallery
                className="h-[600px] w-full"
                itemCount={traits.length}
                itemSize={128 + 2 * 4}
                scrollContainerPadding={4}
                title={`Choose the ${formatTraitType(traitType)}`}
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
                            onPick?.({
                              ...currentTraits,
                              [traitType]: traits[virtualItem.index],
                            });
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
