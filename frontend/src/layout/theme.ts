import { ThemeOptions } from "@mui/material";

export const muiTheme: ThemeOptions = {
  palette: {
    primary: {
      light: "#6a6d87",
      main: "#7d8bae",
      dark: "#30334a",
      contrastText: "#a0a3bd",
    },
    secondary: {
      light: "#a05d56",
      main: "#e5857b",
      dark: "#ea9d95",
      contrastText: "#a0a3bd",
    },

    text: {
      primary: "#a0a3bd",
      secondary: "#a0a3bd",
    },
    background: {
      default: "#14142b",
      paper: "#24263a",
    },
    error: {
      main: "rgb(224, 58, 69)",
      contrastText: "rgb(224, 58, 69)",
    },
  },
};
