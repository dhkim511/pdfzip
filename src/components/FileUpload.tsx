/** @jsxImportSource @emotion/react */
import React from "react";
import { Form, Upload, Button } from "antd";
import {
  UploadOutlined,
  FileAddOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  FormValues,
  FileChangeInfo,
  ConversionType,
} from "../types/conversionType";
import { uploadButton } from "../styles/styles";
import { FormLabel } from "./Label";

interface FileUploadProps {
  fileList: FormValues["files"];
  handleFileChange: (info: FileChangeInfo) => void;
  handleSignFileChange: (info: FileChangeInfo) => void;
  conversionType: ConversionType;
}

const FileUpload: React.FC<FileUploadProps> = ({
  fileList,
  handleFileChange,
  handleSignFileChange,
}) => {
  return (
    <div css={{ display: "flex", gap: "16px" }}>
      <Form.Item
        name="files"
        label={<FormLabel icon={<FileAddOutlined />}>파일 첨부</FormLabel>}
        rules={[{ required: true, message: "파일을 첨부해주세요" }]}
        css={{ flex: 1 }}
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
        label={<FormLabel icon={<EditOutlined />}>서명 첨부</FormLabel>}
        css={{ flex: 1 }}
      >
        <Upload
          beforeUpload={() => false}
          onChange={handleSignFileChange}
          accept=".png"
          maxCount={1}
        >
          <Button icon={<UploadOutlined />} css={uploadButton}>
            파일 선택
          </Button>
        </Upload>
      </Form.Item>
    </div>
  );
};

export default FileUpload;
