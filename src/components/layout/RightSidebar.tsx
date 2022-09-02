import { Layers } from "../panels/Layers";
import { Preview } from "../panels/Preview";
import { Sidebar } from "./Sidebar";

export const RightSidebar = () => {
  return (
    <Sidebar w="352px">
      <Preview />
      <Layers />
    </Sidebar>
  );
};
