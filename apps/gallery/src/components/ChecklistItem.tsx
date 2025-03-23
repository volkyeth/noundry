import EmptyBox from "pixelarticons/svg/checkbox-on.svg";
import Checkbox from "pixelarticons/svg/checkbox.svg";
import WarningBox from "pixelarticons/svg/warning-box.svg";
import { FC } from "react";

export interface ChecklistItemProps
  extends React.HTMLAttributes<HTMLLIElement> {
  isTicked?: boolean;
  isUserTickable?: boolean;
  tickableContent?: React.ReactNode;
  warningContent?: React.ReactNode;
}

export const ChecklistItem: FC<ChecklistItemProps> = ({
  isTicked,
  isUserTickable,
  tickableContent,
  children,
  warningContent,
  onClick,
  ...props
}) => {
  return (
    <li {...props}>
      <p>
        {isTicked === undefined ? (
          <EmptyBox className="align-bottom inline h-7 w-7 text-gray-500" />
        ) : isTicked ? (
          <Checkbox className="align-bottom inline h-7 w-7 text-green-500" />
        ) : isUserTickable ? (
          <EmptyBox
            onClick={onClick}
            className="cursor-pointer align-bottom inline h-7 w-7 text-foreground"
          />
        ) : (
          <WarningBox className="align-bottom inline h-7 w-7 text-red-500" />
        )}{" "}
        {children}
      </p>
      {isUserTickable && isTicked === false && tickableContent && (
        <div className=" p-3 mt-1">{tickableContent}</div>
      )}
      {!isUserTickable && isTicked === false && !!warningContent && (
        <div className="border-1 p-3 mt-1 border-red-200 text-center">
          <p className="text-red-500 text-sm inline">{warningContent}</p>
        </div>
      )}
    </li>
  );
};
