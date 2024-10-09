/** @jsxImportSource @emotion/react */
import React from "react";
import { Form, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { FormValues, FileChangeInfo, ApplicationType } from "../types/applicationType";
import { uploadButton, formLabel, fileUploadLabelDetail, requiredIcon } from "../styles/styles";
import { getFileLabel } from "../utils/labelHandle";

interface FileUploadProps {
  fileList: FormValues["files"];
  handleFileChange: (info: FileChangeInfo) => void;
  applicationType: ApplicationType;
}

const FileUpload: React.FC<FileUploadProps> = ({
  fileList,
  handleFileChange,
  applicationType,
}) => {
  const fileLabelParts = getFileLabel(applicationType).split('(');
  const mainLabel = fileLabelParts[0];
  const detailLabel = fileLabelParts.length > 1 ? `(${fileLabelParts[1]}` : '';

  return (
    <Form.Item
      name="files"
      label={
        <span css={formLabel}>
          <span css={requiredIcon}>*</span>
          {mainLabel}
          <span css={fileUploadLabelDetail}>{detailLabel}</span>
        </span>
      }
      rules={[{ required: true, message: "파일을 첨부해주세요" }]}
    >
      <Upload
        beforeUpload={() => false}
        onChange={handleFileChange}
        multiple
        fileList={fileList}
        listType="picture"
      >
        <Button icon={<UploadOutlined />} css={uploadButton}>
          파일 선택
        </Button>
      </Upload>
    </Form.Item>
  );
};

export default FileUpload;