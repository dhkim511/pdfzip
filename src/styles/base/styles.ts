import { css } from "@emotion/react";
import { colors, sizes } from "./theme";

export const submitButton = css`
  width: 100%;
  height: ${sizes.height.button};
  color: ${colors.primary};
  border-color: ${colors.primary};
  border-radius: ${sizes.borderRadius.large};
  
  &:hover {
    color: ${colors.primaryHover};
    border-color: ${colors.primaryHover};
  }
`;

export const uploadButton = css`
  width: 100%;
  height: ${sizes.height.control};
  border-radius: ${sizes.borderRadius.small};
`;

export const downloadButtonGroup = css`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 8px;
`;

export const downloadButton = css`
  width: 49%;
  height: ${sizes.height.control};
  border-radius: ${sizes.borderRadius.small};
`;

export const datePicker = css`
  width: 100%;
`;

export const link = css`
  margin-left: 20px;
  color: ${colors.primary};
  
  &:hover {
    color: ${colors.primaryHover};
  }
`;

export const signatureCanvas = {
  border: `1px solid ${colors.border}`,
  borderRadius: sizes.borderRadius.small,
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