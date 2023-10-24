import {
  Link,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarItemProps,
  NavbarMenu,
  NavbarMenuToggle,
  Navbar as NextUiNavbar,
} from "@nextui-org/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import LogoImage from "public/FrameLogo.svg";
import { FC, useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { UserAvatar } from "./UserAvatar";

import { TfiMenu } from "react-icons/tfi";
import { useAccount } from "wagmi";
import { ConnectButton } from "./ConnectButton";
import Dynamic from "./Dynamic";
import { MiniConnectButton } from "./MiniConnectButton";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { address } = useAccount();
  const { events } = useRouter();
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
      className="md:py-2"
      maxWidth="full"
    >
      <div className="container flex items-center mx-auto">
        <NavbarContent>
          <NavbarBrand className="gap-2" as={NextLink} href={"/"}>
            <LogoImage className="h-10 w-10 md:h-16 md:w-16" />
            <p className="text-xs md:text-medium uppercase font-Inter font-bold tracking-widest">
              Noundry
              <br />
              Gallery
            </p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-6" justify="center">
          <NavbarLink href={"/"}>Traits</NavbarLink>
          <NavbarLink href={"/artists"}>Artists</NavbarLink>

          <NavbarLink href={"/guidelines"} className="hidden xl:flex">
            Guidelines
          </NavbarLink>
          <NavbarLink href={"/about"} className="hidden xl:flex">
            About
          </NavbarLink>

        </NavbarContent>
        <NavbarContent justify="end">
        <NavbarLink href={"/submit"} className="hidden xl:flex font-bold border-2 !text-[#fff] border-black p-2 bg-primary">
            Submit Trait
        </NavbarLink>
          {address && (
            <NavbarLink href={`/profile/${address}`} className="hidden lg:flex ">
              <UserAvatar address={address} />
            </NavbarLink>
          )}
          <NavbarItem className="hidden md:flex border-2">
            <ConnectButton />
          </NavbarItem>
          <NavbarItem className="md:hidden">
            <MiniConnectButton />
          </NavbarItem>

          <Dynamic>
            <NavbarMenuToggle
              className="w-fit h-fit xl:hidden"
              icon={(isOpen) =>
                isOpen ? (
                  <IoCloseSharp className="w-5 h-5" />
                ) : (
                  <TfiMenu className="w-5 h-5" />
                )
              }
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            />
          </Dynamic>
        </NavbarContent>
        <NavbarMenu className="bg-dark bg-opacity-20 p-0 items-end xl:hidden">
          <ul className="flex flex-col gap-4 p-8 border-t-4   w-64 bg-content2">
            <NavbarItem className="mb-6 self-center md:hidden">
              <ConnectButton />
            </NavbarItem>
            <NavbarLink  href={"/submit"}>Submit Trait</NavbarLink>
            {address && (
              <NavbarLink href={`/profile/${address}`} className="lg:hidden">
                Profile
              </NavbarLink>
            )}
            <NavbarLink href={"/"} className="sm:hidden">
              Traits
            </NavbarLink>
            <NavbarLink href={"/artists"} className="sm:hidden">
              Artists
            </NavbarLink>
            <NavbarLink href={"/guidelines"}>Guidelines</NavbarLink>
            <NavbarLink href={"/about"}>About</NavbarLink>

            <div className="mt-20">
              <p className="font-normal text-sm text-black">
                Check out
              </p>
              <a href="https://studio.noundry.wtf/" target="_blank">
                <p className="font-Pix text-black py-1 hover:!text-primary text-xs">
                  Noundry Studio
                </p>
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
          style={{ color: isActive ? "black" : undefined }}
          className="uppercase "
          href={href}
          aria-current={isActive ? "page" : undefined}
        >
          {children}
        </Link>
      </NavbarItem>
    </Dynamic>
  );
};
