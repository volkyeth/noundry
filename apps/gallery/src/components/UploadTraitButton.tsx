import { useModal, useSIWE } from "connectkit";
import { FC, useState } from "react";
import ModalComp from "./Modal/ModalComp";
import { Button } from "@nextui-org/react";

export interface UploadTraitButtonProps {
  traitsData: any;
}

export const UploadTraitButton: FC<UploadTraitButtonProps> = ({
  traitsData,
  ...props
}) => {

  return (
    <Button>
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
    </Butt>
  );
};
