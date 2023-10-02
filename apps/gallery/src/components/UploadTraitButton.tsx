import { useModal, useSIWE } from "connectkit";
import { FC, useState } from "react";
import ModalComp from "./Modal/ModalComp";

export interface UploadTraitButtonProps {
  traitsData: any;
}

export const UploadTraitButton: FC<UploadTraitButtonProps> = ({
  traitsData,
  ...props
}) => {
const { openSIWE } = useModal();
const { isSignedIn } = useSIWE();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        {...props}
        onClick={() => {
          if (!isSignedIn) return openSIWE();

          setIsModalOpen(!isModalOpen);
        }}
      >
        Upload Trait
      </button>
      {isModalOpen && (
        <ModalComp traitsData={traitsData} setIsModalOpen={setIsModalOpen} />
      )}
    </>
  );
};
