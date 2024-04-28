import { Link } from "@mui/material";
import React, { ReactNode } from "react";
import { BrowserOpenURL } from "../../wailsjs/runtime/runtime";

interface Link {
  children: ReactNode;
  href: string;
}

export const BrowserLink: React.FC<Link> = (props) => {
  const handleClick = () => {
    BrowserOpenURL(props.href);
  };
  return (
    <span onClick={handleClick}>
      <Link>{props.children}</Link>
    </span>
  );
};
