import { css } from "@emotion/react";
import { colors, sizes } from "./theme";

export const submitButton = css`
  width: 100%;
  height: ${sizes.height.button};
  border-radius: ${sizes.borderRadius.large};
`;

export const buttonGroup = css`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 8px;
`;

export const downloadButton = css`
  width: 49%;
  height: auto;
  min-height: ${sizes.height.control};
  border-radius: ${sizes.borderRadius.small};
  white-space: normal;
`;

export const datePicker = css`
  width: 100%;
`;

export const signatureContainer = css`
  width: 100%;
  height: 180px;
  position: relative;
  overflow: hidden;
  border: 1px solid ${colors.border};
  border-radius: ${sizes.borderRadius.small};
  background-color: ${colors.background.white};
`;

export const uploadList = css`
  .ant-upload-list-item {
    max-width: 100%;
  }
`;

export const labelIcon = {
  color: colors.text.primary,
};

export const labelText = {
  color: colors.text.primary,
};

export const typographyTextStyle = css`
  color: ${colors.text.primary};
`;

export const alertStyle = css`
  &.ant-alert-warning {
    background-color: #fff2f0;
    border: 1px solid #ffccc7;

    .ant-alert-icon {
      color: #ff4d4f;
    }

    .ant-alert-message {
      color: #ff4d4f;
    }

    .ant-alert-description {
      color: #ff4d4f;

      .ant-typography {
        color: #ff4d4f;
        margin-left: 8px;
      }
    }
  }
`;

export const fileUpload = {
  wrapper: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  `,
  uploadSection: css`
    display: flex;
    gap: 12px;
    width: 100%;
    align-items: flex-start;
  `,
  tagContainer: css`
    flex: 1;
    min-width: 0;
  `,
  buttonHover: css`
    &:hover {
      color: ${colors.primary} !important;
      border-color: ${colors.primary} !important;
    }
  `,
};

export const fileTag = {
  container: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  requirementContainer: css`
    display: flex;
    gap: 6px;
    align-items: baseline;
  `,
  filesContainer: css`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: baseline;
  `,
  categoryText: {
    fontSize: "13px",
    color: colors.text.secondary,
    whiteSpace: "nowrap" as const,
  },
  tagWrapper: css`
    display: flex;
    gap: 8px;
    align-items: baseline;
  `,
};
