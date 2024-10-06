import { ThemeConfig } from "antd/es/config-provider/context";

export const antThemeConfig: ThemeConfig = {
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
};
