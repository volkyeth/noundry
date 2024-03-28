import { FC, HTMLAttributes } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { twMerge } from "tailwind-merge";
import styles from "./ProposalPreview.module.css";

export interface ProposalPreviewProps extends HTMLAttributes<HTMLDivElement> {
  description: string;
}

export const ProposalPreview: FC<ProposalPreviewProps> = ({
  description,
  className,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        "p-4 sm:p-8 bg-content1 shadow-md text-black rounded-md items-start gap-8",
        className
      )}
      {...props}
    >
      <ReactMarkdown
        className={`${styles.markdown}`}
        remarkPlugins={[remarkBreaks]}
      >
        {description}
      </ReactMarkdown>
    </div>
  );
};
