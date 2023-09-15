import { StackProps, VStack } from "@chakra-ui/react";
import { FC } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import styles from "./ProposalPreview.module.css";

export interface ProposalPreviewProps extends StackProps {
  description: string;
}

export const ProposalPreview: FC<ProposalPreviewProps> = ({ description, ...props }) => {
  return (
    <VStack p={[4, 8]} bgColor={"white"} color={"black"} borderRadius={"md"} alignItems={"start"} spacing={8} {...props}>
      <ReactMarkdown className={`${styles.markdown}`} remarkPlugins={[remarkBreaks]}>
        {description}
      </ReactMarkdown>
    </VStack>
  );
};
