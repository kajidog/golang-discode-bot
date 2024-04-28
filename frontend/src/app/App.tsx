import { ChangeEvent, useEffect, useState } from "react";
import RouterComponent from "./router";
import { BotProvider } from "./bot/BotProvider";
import { BrowserRouter } from "react-router-dom";
import { muiTheme } from "../layout/theme";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

function App() {
  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = createTheme({
    ...muiTheme,
    palette: {
      ...muiTheme.palette,
      mode: isDarkMode ? "dark" : "light",
    },
  });

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BotProvider>
          <RouterComponent />
        </BotProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
