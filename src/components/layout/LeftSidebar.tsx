import { Box } from "@chakra-ui/react";
import { HexColorPicker } from "react-colorful";
import { useToolboxState } from "../../state/toolboxState";
import { Palette } from "../panels/Palette";
import { Panel } from "../panels/Panel";
import { Toolbox } from "../panels/Toolbox";
import { Sidebar } from "./Sidebar";

export const LeftSidebar = () => {
  const { color, setColor } = useToolboxState((state) => ({
    color: state.color,
    setColor: state.setColor,
  }));

  return (
    <Sidebar w={64}>
      <Toolbox />
      <Palette />
    </Sidebar>
  );
};
