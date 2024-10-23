import { css } from "@emotion/react";

export const colors = {
  primary: '#FC1C49',
  primaryHover: '#d11539',
  border: '#d9d9d9',
  text: {
    primary: '#595959',
    secondary: '#8c8c8c',
    light: '#bfbfbf',  
  },
  background: {
    main: '#f6f6f6',
    white: '#ffffff',
  }
};

export const sizes = {
  borderRadius: {
    small: '6px',
    medium: '8px',
    large: '10px',
  },
  height: {
    control: '38px',
    button: '48px',
  },
  width: {
    maxContent: '1300px',
  },
};

export const fonts = {
  size: {
    small: '13px',  
    medium: '15px', 
    large: '17px',  
  },
  weight: {
    normal: '400',
    medium: '500',
    bold: '700',
  },
  lineHeight: {
    small: '1.4',
    medium: '1.6',
    large: '1.8',
  },
};

export const spacing = {
  xs: '16px',
  sm: '24px',
  md: '40px',
  lg: '60px',
  margin: {
    bottom: {
      xs: css`margin-bottom: 16px;`,
      sm: css`margin-bottom: 24px;`,
      md: css`margin-bottom: 40px;`,
      lg: css`margin-bottom: 60px;`,
    }
  }
};
