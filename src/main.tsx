import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";
import ko_KR from "antd/locale/ko_KR";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import App from "./App";

dayjs.locale("ko");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider
      locale={ko_KR}
      theme={{
        token: {
          colorPrimary: "#FC1C49",
          fontSize: 15,
          controlHeight: 38,
        },
        components: {
          Select: {
            colorBgContainer: "#ffffff",
            colorBorder: "#d9d9d9",
            controlItemBgHover: "#f5f5f5",
            controlItemBgActive: "#f5f5f5",
            colorPrimaryHover: "#d9d9d9",
            colorPrimaryActive: "#d9d9d9",
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>
);
