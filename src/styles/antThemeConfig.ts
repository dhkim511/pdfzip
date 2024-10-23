import { ThemeConfig } from "antd/es/config-provider/context";

export const antThemeConfig: ThemeConfig = {
  token: {
    colorPrimary: "#FC1C49",
    colorBorder: "#d9d9d9",
    fontSize: 15,
    controlHeight: 38,
    borderRadius: 6,
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
    Button: {
      borderRadius: 6,
      controlHeight: 38,
    },
    Input: {
      borderRadius: 6,
      controlHeight: 38,
    },
    DatePicker: {
      borderRadius: 6,
      controlHeight: 38,
    },
    Form: {
      marginLG: 24,
    }
  },
};