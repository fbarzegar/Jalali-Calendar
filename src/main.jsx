import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";

// ایجاد cache برای RTL
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

// تم RTL
const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: "Vazir, Roboto, Arial", // فونت فارسی دلخواه
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <CacheProvider value={cacheRtl}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </CacheProvider>
);
