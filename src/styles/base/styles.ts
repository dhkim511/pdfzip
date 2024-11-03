import { css } from "@emotion/react";
import { colors, sizes } from "./theme";

export const submitButton = css`
  width: 100%;
  height: ${sizes.height.button};
  color: ${colors.primary};
  border-color: ${colors.primary};
  border-radius: ${sizes.borderRadius.large};

  &:hover {
    opacity: 0.65;
  }
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

export const link = css`
  margin-left: 19px;
`;

export const signatureCanvas = {
  border: `1px solid ${colors.border}`,
  borderRadius: sizes.borderRadius.small,
  width: '100%',
  height: '100%',
  touchAction: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
  userSelect: 'none',
  display: 'block'
};

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
    background-color: rgba(252, 28, 73, 0.03);
    border: 1px solid rgba(252, 28, 73, 0.4);

    .ant-alert-icon {
      color: #ff4d6d;
    }

    .ant-alert-message {
      color: #ff4d6d;
    }

    .ant-alert-description {
      color: #ff4d6d;
      
      .ant-typography {
        color: #ff4d6d;
        margin-left: 8px;
      }
    }
  }
`;