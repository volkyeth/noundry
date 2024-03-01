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
} from "@nextui-org/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import LogoImage from "public/NoundryGalleryLogo.svg";
import { FC, useEffect, useState } from "react";

import { Button } from "@/components/Button";
import { NotificationListLauncher } from "@cord-sdk/react";
import { useSIWE } from "connectkit";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa6";
import { RiCloseFill, RiMenuFill, RiUpload2Fill } from "react-icons/ri";
import { twMerge } from "tailwind-merge";
import { useAccount } from "wagmi";
import { ConnectButton } from "./ConnectButton";
import Dynamic from "./Dynamic";

const Navbar = () => {
  const { isSignedIn } = useSIWE();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { address } = useAccount();
  const { events, asPath: currentPage } = useRouter();
  useEffect(() => {
    const handler = () => setIsMenuOpen(false);
    events.on("routeChangeComplete", handler);
    return () => events.off("routeChangeComplete", handler);
  }, [events, setIsMenuOpen]);

  return (
    <div className="w-full flex flex-col">
      <NextUiNavbar
        disableAnimation
        isBlurred={false}
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        className="md:py-2 bg-brand-yellow"
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
              {isSignedIn && (
                <NotificationListLauncher iconUrl="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'  width='28' height='28' viewBox='0 0 24 24'%3E%3Cpath d='M5 18H19V11.0314C19 7.14806 15.866 4 12 4C8.13401 4 5 7.14806 5 11.0314V18ZM12 2C16.9706 2 21 6.04348 21 11.0314V20H3V11.0314C3 6.04348 7.02944 2 12 2ZM9.5 21H14.5C14.5 22.3807 13.3807 23.5 12 23.5C10.6193 23.5 9.5 22.3807 9.5 21Z'%3E%3C/path%3E%3C/svg%3E" />
              )}
            </Dynamic>
            <Dynamic>
              <NavbarMenuToggle
                className="w-fit h-fit p-2 text-off-light"
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
    </div>
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
            isActive ? "text-secondary font-semibold" : "text-secondary-300"
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
