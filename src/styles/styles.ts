import { css } from "@emotion/react";

export const appContainer = css`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f6f6f6;
`;

export const formContainer = css`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  border-radius: 10px;
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

export const guideSection = css`
  flex: 1;
  padding: 20px 20px 0 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
`;

export const linkSection = css`
  padding: 20px 20px 0 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
`;

export const formSection = css`
  flex: 1;
  padding: 20px 20px 0 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
`;

export const link = css`
  margin-left: 10px;
`;

export const requiredIcon = css`
  color: #fc1c49;
  margin-right: 4px;
  font-size: 16px;
  line-height: 1;
`;

export const formLabel = css`
  font-weight: bold;
`;

export const fileUploadLabelDetail = css`
  color: #fc1c49;
  font-size: 14px;
  font-weight: 500;
`;

export const datePicker = css`
  width: 100%;
`;

export const fileUpload = css`
  width: 100%;
`;

export const uploadButton = css`
  width: 100%;
`;

export const downloadButtonGroup = css`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const downloadButton = css`
  width: 49%;
  margin-right: 2%;
  &:last-of-type {
    margin-right: 0;
  }
`;

export const submitButton = css`
  width: 100%;
  height: 48px;
  color: #fc1c49;
  border-color: #fc1c49;
  border-radius: 10px;
`;
