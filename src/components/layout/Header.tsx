import { ReactComponent as LogoNoggles } from "@/assets/NoundryStudio.svg";
import { HStack, StackProps } from "@chakra-ui/react";
import { FC } from "react";
import { Link } from "react-router-dom";

export const Header: FC<StackProps> = ({ ...props }) => {
  return (
    <HStack {...props} bg="gray.800" w="full" h={20} p={6} spacing={8}>
      <Link to="/">
        <LogoNoggles />
      </Link>
    </HStack>
  );
};
