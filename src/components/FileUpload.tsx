/** @jsxImportSource @emotion/react */
import React from "react";
import { Form, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { FormValues, FileChangeInfo } from "../types/applicationType";
import { fileUpload, uploadButton, formLabel } from "../styles/styles";

interface FileUploadProps {
  fileList: FormValues["files"];
  handleFileChange: (info: FileChangeInfo) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  fileList,
  handleFileChange,
}) => {
  return (
    <Form.Item
      name="files"
      label={<span css={formLabel}>파일 첨부</span>}
      rules={[{ required: true, message: "파일을 첨부해주세요" }]}
    >
      <Upload
        beforeUpload={() => false}
        onChange={handleFileChange}
        multiple
        fileList={fileList}
        listType="picture"
        css={fileUpload}
      >
        <Button icon={<UploadOutlined />} css={uploadButton}>
          파일 선택
        </Button>
      </Upload>
    </Form.Item>
  );
};

export default FileUpload;
