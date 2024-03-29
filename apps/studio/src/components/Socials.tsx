import { HStack, Icon, Image, Link, StackProps, Tooltip } from "@chakra-ui/react";
import { FC } from "react";
import { FaDiscord } from "react-icons/fa";
import { RiGithubFill } from "react-icons/ri";
import volky from "../assets/volky.png";

export const Socials: FC<StackProps> = (props) => {
  return (
    <HStack {...props}>
      <Link isExternal href={"https://github.com/volkyeth/noundry-studio"} h={"full"}>
        <Icon as={RiGithubFill} h={"full"} w={"auto"} />
      </Link>
      <Link isExternal href={"https://discord.gg/cS5eKgHdgJ"} h={"full"}>
        <Icon as={FaDiscord} h={"full"} w={"auto"} />
      </Link>
      <Tooltip hasArrow label={"by Volky (gimme feedback)"} placement={"top"}>
        <Link isExternal href={"https://twitter.com/volkyeth"} h={"full"}>
          <Image src={volky} h={"full"} />
        </Link>
      </Tooltip>
    </HStack>
  );
};
