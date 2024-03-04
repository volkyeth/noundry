import { useIncludeTraitTypes } from "@/hooks/useIncludeTraitTypes";
import { formatTraitType } from "@/utils/traits/format";
import {
  Checkbox,
  CheckboxGroup,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { TraitType } from "noggles";
import { FC, useState } from "react";
import { Button } from "./Button";

export interface GalleryFilterModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const GalleryFilterModal: FC<GalleryFilterModalProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const [includeTypes, setIncludeTypes] = useIncludeTraitTypes();
  const [updatedIncludeTypes, setUpdatedIncludeTypes] = useState<
    ("heads" | "accessories")[]
  >(includeTypes ?? ["heads", "accessories"]);

  return (
    <Modal disableAnimation isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Filter traits
            </ModalHeader>
            <ModalBody className="flex flex-col gap-4">
              <CheckboxGroup
                label="Trait types"
                value={updatedIncludeTypes}
                //@ts-expect-error
                onChange={setUpdatedIncludeTypes}
                defaultValue={
                  includeTypes ?? ["heads", "glasses", "accessories", "bodies"]
                }
              >
                {["heads", "accessories"].map((type: TraitType) => (
                  <Checkbox disableAnimation key={type} value={type}>
                    {formatTraitType(type)}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setIncludeTypes(updatedIncludeTypes);
                  onClose();
                }}
              >
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
