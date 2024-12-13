import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";
import ko_KR from "antd/locale/ko_KR";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import App from "./App";
import { antTheme } from "./styles/theme";
import "./index.css";

dayjs.locale("ko");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider locale={ko_KR} theme={antTheme}>
      <App />
    </ConfigProvider>
  </StrictMode>
);
