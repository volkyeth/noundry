import EmptyBox from "pixelarticons/svg/checkbox-on.svg";
import Checkbox from "pixelarticons/svg/checkbox.svg";
import WarningBox from "pixelarticons/svg/warning-box.svg";
import { FC } from "react";

export interface ChecklistItemProps
  extends React.HTMLAttributes<HTMLLIElement> {
  isValid?: boolean;
  warningContent?: React.ReactNode;
}

export const ChecklistItem: FC<ChecklistItemProps> = ({
  isValid,
  children,
  warningContent,
}) => {
  return (
    <li>
      <p>
        {isValid === undefined ? (
          <EmptyBox className="align-bottom inline h-7 w-7 text-gray-500" />
        ) : isValid ? (
          <Checkbox className="align-bottom inline h-7 w-7 text-green-500" />
        ) : (
          <WarningBox className="align-bottom inline h-7 w-7 text-red-500" />
        )}{" "}
        {children}
      </p>
      {isValid === false && (
        <div className="border-1 p-3 mt-1 border-red-200 text-center">
          <p className="text-red-500 text-sm inline">{warningContent}</p>
        </div>
      )}
    </li>
  );
};
