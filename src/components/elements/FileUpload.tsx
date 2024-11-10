/** @jsxImportSource @emotion/react */
import React from "react";
import { Form, Upload, Button } from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { UploadFile } from "antd/es/upload/interface";
import { FileChangeInfo, ConversionType } from "../../types/conversionType";
import { flexLayout, fullWidth, uploadList, fileUpload } from "../../styles";
import { FormLabel } from "../common/Label";
import FileTag from "./FileTag";

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
  const handleFirstUploadChange = (info: FileChangeInfo) => {
    const newInfo = {
      ...info,
      fileList: [...fileList, ...info.fileList],
    };
    handleFileChange(newInfo);
  };

  return (
    <div css={flexLayout.container}>
      <Form.Item
        name="files"
        label={<FormLabel icon={<UploadOutlined />}>파일 업로드</FormLabel>}
        rules={[{ required: true, message: "파일을 첨부해주세요" }]}
        css={[fullWidth]}
      >
        <div css={fileUpload.wrapper}>
          <div css={fileUpload.uploadSection}>
            <Upload
              beforeUpload={() => false}
              onChange={handleFirstUploadChange}
              multiple
              fileList={[]}
              showUploadList={false}
            >
              <Button
                icon={<PlusOutlined />}
                style={{
                  width: "60px",
                  height: "60px",
                  color: "#595959",
                  border: "1px solid #d9d9d9",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                css={fileUpload.buttonHover}
              />
            </Upload>
            <div css={fileUpload.tagContainer}>
              <FileTag type={conversionType} />
            </div>
          </div>
          <Upload
            beforeUpload={() => false}
            onChange={handleFileChange}
            multiple
            fileList={fileList}
            listType="picture"
            css={uploadList}
            showUploadList={{ showRemoveIcon: true }}
          />
        </div>
      </Form.Item>
    </div>
  );
};

export default FileUpload;
