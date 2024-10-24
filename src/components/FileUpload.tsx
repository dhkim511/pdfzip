/** @jsxImportSource @emotion/react */
import React from "react";
import { Form, Upload, Button, Typography } from "antd";
import {
  UploadOutlined,
  FileAddOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { UploadFile } from "antd/es/upload/interface";
import { FileChangeInfo, ConversionType } from "../types/conversionType";
import {
  flexLayout,
  halfWidth,
  redTextStyle,
  uploadButton,
  uploadList,
} from "../styles/index";
import { FormLabel } from "./Label";
import { getFileLabel } from "../utils/labelHandle";
import { colors, fonts } from "../styles/index";

const { Text } = Typography;

interface FileUploadProps {
  fileList: UploadFile[];
  handleFileChange: (info: FileChangeInfo) => void;
  handleSignFileChange: (info: FileChangeInfo) => void;
  conversionType: ConversionType;
}

const FileUpload: React.FC<FileUploadProps> = ({
  fileList,
  handleFileChange,
  handleSignFileChange,
  conversionType,
}) => {
  const renderFileLabel = (conversionType: ConversionType) => {
    const label = getFileLabel(conversionType);
    if (label.includes("(")) {
      const [mainLabel, highlightedText] = label.split("(");
      return (
        <>
          {mainLabel}
          <Text
            style={{
              color: colors.primary,
              fontSize: fonts.size.small,
              fontWeight: fonts.weight.medium,
            }}
          >
            ({highlightedText}
          </Text>{" "}
        </>
      );
    }
    return label;
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
        css={[halfWidth, flexLayout.flex1]}
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
      <Form.Item
        name="signFile"
        label={
          <FormLabel icon={<EditOutlined />}>
            {" "}
            파일 선택 <span css={redTextStyle}>(sign.png)</span>
          </FormLabel>
        }
        css={[halfWidth, flexLayout.flex1]}
      >
        <Upload
          beforeUpload={() => false}
          onChange={handleSignFileChange}
          accept=".png"
          maxCount={1}
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
