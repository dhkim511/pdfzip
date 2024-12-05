import { ThemeConfig } from "antd/es/config-provider/context";

export const colors = {
  primary: "#ed234b",
  border: "#d9d9d9",
  text: {
    primary: "#595959",
    secondary: "#8c8c8c",
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
  width: {
    maxContent: "1300px",
  },
  height: {
    control: "38px",
    button: "48px",
  },
};

export const antTheme: ThemeConfig = {
  token: {
    colorPrimary: colors.primary,
    colorBorder: colors.border,
    fontSize: 16,
    controlHeight: parseInt(sizes.height.control),
    borderRadius: parseInt(sizes.borderRadius.small),
  },
  components: {
    Select: {
      colorBgContainer: colors.background.white,
      colorBorder: colors.border,
      controlItemBgHover: "transparent",
      controlItemBgActive: "#f5f5f5",
      colorPrimaryHover: colors.border,
      colorBgElevated: colors.background.white,
    },
    Button: {
      borderRadius: parseInt(sizes.borderRadius.small),
      controlHeight: parseInt(sizes.height.control),
    },
    Input: {
      borderRadius: parseInt(sizes.borderRadius.small),
      controlHeight: parseInt(sizes.height.control),
      hoverBorderColor: colors.border,
    },
    DatePicker: {
      borderRadius: parseInt(sizes.borderRadius.small),
      controlHeight: parseInt(sizes.height.control),
      hoverBorderColor: colors.border,
    },
    Form: {
      marginLG: 24,
    },
  },
};
