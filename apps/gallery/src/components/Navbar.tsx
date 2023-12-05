import FarcasterIcon from "@/assets/icons/farcaster.svg";
import {
  Link,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarItemProps,
  NavbarMenu,
  NavbarMenuToggle,
  Navbar as NextUiNavbar,
  useDisclosure,
} from "@nextui-org/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import LogoImage from "public/NoundryGalleryLogo.svg";
import { FC, useEffect, useState } from "react";

import { Button } from "@/components/Button";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa6";
import { RiCloseFill, RiMenuFill, RiUpload2Fill } from "react-icons/ri";
import { twMerge } from "tailwind-merge";
import { useAccount } from "wagmi";
import { ConnectButton } from "./ConnectButton";
import Dynamic from "./Dynamic";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { address } = useAccount();
  const { events, asPath: currentPage } = useRouter();
  useEffect(() => {
    const handler = () => setIsMenuOpen(false);
    events.on("routeChangeComplete", handler);
    return () => events.off("routeChangeComplete", handler);
  }, [events, setIsMenuOpen]);

  return (
    <NextUiNavbar
      disableAnimation
      isBlurred={false}
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="shadow-sm md:py-2"
      classNames={{ wrapper: "px-2 xs:px-4" }}
      maxWidth="full"
    >
      <div className="container flex items-center mx-auto">
        <NavbarContent>
          <NavbarBrand className="gap-2" as={NextLink} href={"/"}>
            <LogoImage className="h-[36px] md:h-[54px]" />
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden xl:flex gap-12" justify="center">
          <NavbarLink href={"/"}>Traits</NavbarLink>
          <NavbarLink href={"/artists"}>Artists</NavbarLink>
        </NavbarContent>
        <NavbarContent justify="end" className="gap-2">
          <NavbarButton href={"/submit"} className="hidden xs:flex">
            Submit
          </NavbarButton>
          <NavbarButton
            href={"/submit"}
            className="flex xs:hidden"
            classNames={{ button: "p-2" }}
          >
            <RiUpload2Fill size={24} />
          </NavbarButton>

          <NavbarItem className="hidden md:flex">
            <ConnectButton />
          </NavbarItem>

          <Dynamic>
            <NavbarMenuToggle
              className="w-fit h-fit p-2 text-off-dark"
              icon={(isOpen) =>
                isOpen ? <RiCloseFill size={24} /> : <RiMenuFill size={24} />
              }
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            />
          </Dynamic>
        </NavbarContent>
        <NavbarMenu className="bg-dark bg-opacity-40 p-0 items-end">
          <ul className="flex flex-col gap-4 p-8 w-64 bg-content2">
            <NavbarItem className="mb-6 self-center md:hidden">
              <ConnectButton />
            </NavbarItem>
            {address && (
              <NavbarLink href={`/profile/${address}`}>Profile</NavbarLink>
            )}
            <NavbarLink href={"/"} className="xl:hidden">
              Traits
            </NavbarLink>
            <NavbarLink href={"/artists"} className="xl:hidden">
              Artists
            </NavbarLink>
            <NavbarLink href={"/guidelines"}>Guidelines</NavbarLink>
            <NavbarLink href={"/about"}>About</NavbarLink>

            <div className="mt-20">
              <p className="font-normal text-sm text-off-dark">Check out</p>
              <a href="https://studio.noundry.wtf/" target="_blank">
                <p className="font-Pix text-off-dark py-1 hover:!text-primary text-xs">
                  Noundry Studio
                </p>
              </a>
            </div>

            <div className="flex gap-4">
              <a href={`https://warpcast.com/noundry`} target="_blank">
                <FarcasterIcon />
              </a>
              <a href={`https://twitter.com/noundry`} target="_blank">
                <FaTwitter />
              </a>
              <a href={`https://discord.gg/XbYPDSKVaV`} target="_blank">
                <FaDiscord />
              </a>
              <a href={`https://github.com/volkyeth/noundry`} target="_blank">
                <FaGithub />
              </a>
            </div>
          </ul>
        </NavbarMenu>
      </div>
    </NextUiNavbar>
  );
};

export default Navbar;

interface NavbarLinkProps extends NavbarItemProps {
  href: string;
}

const NavbarLink: FC<NavbarLinkProps> = ({ children, href, ...props }) => {
  const { asPath: currentPage } = useRouter();

  const isActive =
    currentPage.toLowerCase().split(/[?#]/)[0] === href.toLowerCase();
  return (
    <Dynamic>
      <NavbarItem isActive={isActive} {...props}>
        <Link
          color="foreground"
          as={NextLink}
          className={twMerge(
            "uppercase hover:text-secondary",
            isActive ? "text-secondary font-semibold" : "text-gray-400"
          )}
          href={href}
          aria-current={isActive ? "page" : undefined}
        >
          {children}
        </Link>
      </NavbarItem>
    </Dynamic>
  );
};

interface NavbarButtonProps extends NavbarItemProps {
  href: string;
  classNames?: {
    button?: string;
  };
}

const NavbarButton: FC<NavbarButtonProps> = ({
  children,
  href,
  classNames,
  ...props
}) => {
  const { asPath: currentPage } = useRouter();

  const isActive =
    currentPage.toLowerCase().split(/[?#]/)[0] === href.toLowerCase();
  return (
    <Dynamic>
      <NavbarItem isActive={isActive} {...props}>
        <NextLink href={href}>
          <Button
            variant={isActive ? "secondary" : "primary"}
            aria-current={isActive ? "page" : undefined}
            className={classNames?.button}
          >
            {children}
          </Button>
        </NextLink>
      </NavbarItem>
    </Dynamic>
  );
};
