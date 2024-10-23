import { ThemeConfig } from "antd/es/config-provider/context";
import { colors, sizes } from "./theme";

export const antThemeConfig: ThemeConfig = {
  token: {
    colorPrimary: colors.primary,
    colorBorder: colors.border,
    fontSize: 15,
    controlHeight: parseInt(sizes.height.control),
    borderRadius: parseInt(sizes.borderRadius.small),
  },
  components: {
    Select: {
      colorBgContainer: colors.background.white,
      colorBorder: colors.border,
      controlItemBgHover: "#f5f5f5",
      controlItemBgActive: "#f5f5f5",
      colorPrimaryHover: colors.border,
      colorPrimaryActive: colors.border,
    },
    Button: {
      borderRadius: parseInt(sizes.borderRadius.small),
      controlHeight: parseInt(sizes.height.control),
    },
    Input: {
      borderRadius: parseInt(sizes.borderRadius.small),
      controlHeight: parseInt(sizes.height.control),
    },
    DatePicker: {
      borderRadius: parseInt(sizes.borderRadius.small),
      controlHeight: parseInt(sizes.height.control),
    },
    Form: {
      marginLG: 24,
    }
  },
};