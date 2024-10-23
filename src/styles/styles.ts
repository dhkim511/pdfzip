import { css } from "@emotion/react";
import { COLORS, SIZES } from "./theme";

export const appContainer = css`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${COLORS.background.main};
`;

export const formContainer = css`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: ${SIZES.width.maxContent};
  border-radius: ${SIZES.borderRadius.large};
  gap: 20px;
`;

export const leftContainer = css`
  width: 50%;
  display: flex;
  flex-direction: column;
`;

export const rightContainer = css`
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const baseSection = css`
  padding: 20px 20px 0 20px;
  background-color: ${COLORS.background.white};
  border-radius: ${SIZES.borderRadius.large};
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
`;

export const guideSection = css`
  ${baseSection}
  flex: 1;
`;

export const formSection = css`
  ${baseSection}
  flex: 1;
`;

export const submitButton = css`
  width: 100%;
  height: ${SIZES.height.button};
  color: ${COLORS.primary};
  border-color: ${COLORS.primary};
  border-radius: ${SIZES.borderRadius.large};
  
  &:hover {
    color: ${COLORS.primaryHover};
    border-color: ${COLORS.primaryHover};
  }
`;

export const uploadButton = css`
  width: 100%;
  height: ${SIZES.height.control};
  border-radius: ${SIZES.borderRadius.small};
`;

export const downloadButtonGroup = css`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 8px;
`;

export const downloadButton = css`
  width: 49%;
  height: ${SIZES.height.control};
  border-radius: ${SIZES.borderRadius.small};
`;

export const signatureCanvas = css`
  border: 1px solid ${COLORS.border};
  border-radius: ${SIZES.borderRadius.small};
  background-color: ${COLORS.background.white};
`;

export const datePicker = css`
  width: 100%;
`;

export const link = css`
  margin-left: 10px;
  color: ${COLORS.primary};
  
  &:hover {
    color: ${COLORS.primaryHover};
  }
`;

export const flexLayout = {
  container: css`
    display: flex;
    gap: 16px;
  `,
  column: css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 0 20px 0;
  `,
  center: css`
    display: flex;
    justify-content: center;
  `,
  end: css`
    display: flex;
    justify-content: flex-end;
  `,
  flex1: css`
    flex: 1;
  `,
  flex00Auto: css`
    flex: 0 0 auto;
  `
};

export const spacing = {
  marginBottom: {
    xs: css`margin-bottom: 16px;`,
    sm: css`margin-bottom: 24px;`,
    md: css`margin-bottom: 40px;`,
    lg: css`margin-bottom: 60px;`,
  }
};