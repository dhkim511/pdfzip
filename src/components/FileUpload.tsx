/** @jsxImportSource @emotion/react */
import React from "react";
import { Form, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  FormValues,
  FileChangeInfo,
  ApplicationType,
} from "../types/applicationType";
import { uploadButton, formLabel } from "../styles/styles";

interface FileUploadProps {
  fileList: FormValues["files"];
  handleFileChange: (info: FileChangeInfo) => void;
  handleSignFileChange: (info: FileChangeInfo) => void;
  applicationType: ApplicationType;
}

const FileUpload: React.FC<FileUploadProps> = ({
  fileList,
  handleFileChange,
  handleSignFileChange,
}) => {
  return (
    <>
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
        >
          <Button icon={<UploadOutlined />} css={uploadButton}>
            파일 선택
          </Button>
        </Upload>
      </Form.Item>
      <Form.Item
        name="signFile"
        label={<span css={formLabel}>서명 이미지</span>}
      >
        <Upload
          beforeUpload={() => false}
          onChange={handleSignFileChange}
          accept=".png"
          maxCount={1}
        >
          <Button icon={<UploadOutlined />} css={uploadButton}>
            서명 첨부
          </Button>
        </Upload>
      </Form.Item>
    </>
  );
};

export default FileUpload;
