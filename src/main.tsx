import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";
import { Global } from "@emotion/react";
import ko_KR from "antd/locale/ko_KR";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import App from "./App";
import { antThemeConfig } from "./styles/index";
import { globalStyle } from "./styles/index";

dayjs.locale("ko");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Global styles={globalStyle} />
    <ConfigProvider locale={ko_KR} theme={antThemeConfig}>
      <App />
    </ConfigProvider>
  </StrictMode>,
);
