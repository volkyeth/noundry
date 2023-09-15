import { cssVar, extendTheme } from "@chakra-ui/react";

const Tooltip = () => {
  const $bg = cssVar("tooltip-bg");
  const $fg = cssVar("tooltip-fg");
  const $arrowBg = cssVar("popper-arrow-bg");
  return {
    baseStyle: {
      fontFamily: '"Press Start 2P", cursive',
      fontSize: 8,
      borderRadius: 0,
      bg: $bg.reference,
      color: $fg.reference,
      [$bg.variable]: "colors.gray.750",
      [$fg.variable]: "colors.gray.100",
      [$arrowBg.variable]: $bg.reference,
      boxShadow: "xs",
    },
  };
};

const config = {
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  styles: {
    global: { "html, body, #root": { height: "100%" } },
  },
  colors: {
    gray: {
      50: "#F2F2F2",
      100: "#DBDBDB",
      150: "#CFCFCF",
      200: "#C4C4C4",
      250: "#B8B8B8",
      300: "#ADADAD",
      350: "#A1A1A1",
      400: "#969696",
      450: "#898989",
      500: "#808080",
      550: "#727272",
      600: "#666666",
      650: "#595959",
      700: "#4D4D4D",
      750: "#404040",
      800: "#333333",
      850: "#272727",
      900: "#1A1A1A",
    },
  },
  components: {
    Button: {
      baseStyle: {
        transitionProperty: "none",
      },
      variants: {
        ghost: {
          _hover: {
            bgColor: "gray.100",
            color: "gray.800",
          },
          _active: {
            bgColor: "transparent",
            color: "white",
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        fontFamily: '"Press Start 2P", cursive',
      },
    },
    Kbd: {
      baseStyle: {
        fontFamily: '"Press Start 2P", cursive',
        fontSize: 10,
        px: 2,
        py: 1,
        borderRadius: 0,
      },
    },
    Tooltip: Tooltip(),
  },
};

export default extendTheme(config);
