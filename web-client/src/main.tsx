import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";
import {
  theme,
  ChakraProvider,
  ColorModeProvider,
  ThemeProvider,
  extendTheme,
} from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <ThemeProvider theme={theme}>
          <ColorModeProvider>
            <App />
          </ColorModeProvider>
        </ThemeProvider>
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
);
