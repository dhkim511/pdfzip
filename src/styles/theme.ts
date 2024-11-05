import { ThemeConfig } from "antd/es/config-provider/context";
import { css } from "@emotion/react";

export const colors = {
  primary: "#ff4d4f",
  primaryHover: "#d11539",
  border: "#d9d9d9",
  text: {
    primary: "#595959",
    secondary: "#8c8c8c",
    light: "#bfbfbf",
  },
  background: {
    main: "#f6f6f6",
    white: "#ffffff",
  },
};

export const sizes = {
  borderRadius: {
    small: "6px",
    medium: "8px",
    large: "10px",
  },
  height: {
    control: "38px",
    button: "48px",
  },
  width: {
    maxContent: "1300px",
  },
};

export const fonts = {
  size: {
    small: "13px",
    medium: "15px",
    large: "17px",
  },
  weight: {
    normal: "400",
    medium: "500",
    bold: "700",
  },
  lineHeight: {
    small: "1.4",
    medium: "1.6",
    large: "1.8",
  },
};

export const spacing = {
  xs: "16px",
  sm: "32px",
  md: "48px",
  lg: "64px",
  xl: "90px",
  margin: {
    bottom: {
      xs: css`margin-bottom: 16px;`,
      sm: css`margin-bottom: 32px;`,
      md: css`margin-bottom: 48px;`,
      lg: css`margin-bottom: 64px;`,
      xl: css`margin-bottom: 90px;`,
    },
  },
};

export const antTheme: ThemeConfig = {
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
    },
  },
};
