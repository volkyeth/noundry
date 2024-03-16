import dynamic from "next/dynamic";
import React from "react";

export const Dynamic = (props) => (
  <React.Fragment>{props.children}</React.Fragment>
);

export default dynamic(() => Promise.resolve(Dynamic), {
  ssr: false,
});
