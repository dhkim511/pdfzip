/** @jsxImportSource @emotion/react */
import React from "react";
import { Form, Upload, Button, Typography } from "antd";
import { UploadOutlined, FileAddOutlined } from "@ant-design/icons";
import { UploadFile } from "antd/es/upload/interface";
import { FileChangeInfo, ConversionType } from "../types/conversionType";
import {
  flexLayout,
  fullWidth,
  uploadButton,
  uploadList,
  colors,
  fonts,
} from "../styles/index";
import { FormLabel } from "./Label";
import { getFileLabel } from "../utils/labelHandle";

const { Text } = Typography;

interface FileUploadProps {
  fileList: UploadFile[];
  handleFileChange: (info: FileChangeInfo) => void;
  conversionType: ConversionType;
}

const FileUpload: React.FC<FileUploadProps> = ({
  fileList,
  handleFileChange,
  conversionType,
}) => {
  const renderFileLabel = (type: ConversionType) => {
    const label = getFileLabel(type);

    if (!label.includes("(")) {
      return label;
    }

    const [mainLabel, highlightedText] = label.split("(");

    return (
      <>
        {mainLabel}
        <Text
          style={{
            color: colors.text.primary,
            fontSize: 13,
            fontWeight: fonts.weight.normal,
          }}
        >
          ({highlightedText}
        </Text>
      </>
    );
  };

  return (
    <div css={flexLayout.container}>
      <Form.Item
        name="files"
        label={
          <FormLabel icon={<FileAddOutlined />}>
            {renderFileLabel(conversionType)}
          </FormLabel>
        }
        rules={[{ required: true, message: "파일을 첨부해주세요" }]}
        css={[fullWidth]}
      >
        <Upload
          beforeUpload={() => false}
          onChange={handleFileChange}
          multiple
          fileList={fileList}
          listType="picture"
          css={uploadList}
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
