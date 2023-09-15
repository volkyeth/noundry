import { ReactComponent as LogoNoggles } from "@/assets/NoundryStudio.svg";
import { Center, Heading, SimpleGrid, StackProps } from "@chakra-ui/react";
import { FC } from "react";
import { Link } from "react-router-dom";
import { create } from "zustand";

export interface HeaderProps extends StackProps {
  sectionTitle?: string;
}

export const Header: FC<HeaderProps> = ({ ...props }) => {
  const { sectionTitle } = useHeaderState();
  return (
    <SimpleGrid templateColumns={"repeat(3,1fr)"} {...props} bg="gray.800" w="full" p={0} spacing={8}>
      <Link to="/">
        <LogoNoggles />
      </Link>
      <Center>
        <Heading fontSize={16}>{sectionTitle}</Heading>
      </Center>
    </SimpleGrid>
  );
};

export interface HeaderState {
  sectionTitle?: string;
}

export const useHeaderState = create<HeaderState>((set) => ({
  sectionTitle: undefined,
}));
