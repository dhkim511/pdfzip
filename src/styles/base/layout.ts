import { css } from "@emotion/react";
import { colors, sizes } from "./theme";

export const appContainer = css`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${colors.background.main};
`;

export const formContainer = css`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: ${sizes.width.maxContent};
  border-radius: ${sizes.borderRadius.large};
  gap: 16px;
`;

export const leftContainer = css`
  width: 40%; 
  display: flex;
  flex-direction: column;
`;

export const rightContainer = css`
  width: 60%; 
  display: flex;
  flex-direction: column;
`;

export const baseSection = css`
  padding: 20px 20px 0 20px;
  background-color: ${colors.background.white};
  border-radius: ${sizes.borderRadius.large};
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
  spaceBetween: css`
    display: flex;
    justify-content: space-between;
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
  `,
};

export const fullWidth = css`
  width: 100%;
`;

export const halfWidth = css`
  flex: 1;
  max-width: 50%;
`;