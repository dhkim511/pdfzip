/** @jsxImportSource @emotion/react */
import React from "react";
import { Form, Select, Input, DatePicker, Button, FormInstance } from "antd";
import {
  FormValues,
  ApplicationType,
  FileChangeInfo,
} from "../types/applicationType";
import FileUpload from "./FileUpload";
import { formLabel, submitButton, datePicker } from "../styles/styles";
import { getDateLabel } from "../utils/fileHandle";

const { Option } = Select;

interface ApplicationFormProps {
  form: FormInstance;
  onFinish: (values: FormValues) => void;
  fileList: FormValues["files"];
  handleFileChange: (info: FileChangeInfo) => void;
  isLoading: boolean;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  form,
  onFinish,
  fileList,
  handleFileChange,
  isLoading,
}) => {
  const applicationType = Form.useWatch("applicationType", form);

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="applicationType"
        label={<span css={formLabel}>신청 유형</span>}
        initialValue="attendance"
        rules={[{ required: true, message: "신청 유형을 선택해주세요" }]}
      >
        <Select>
          <Option value="attendance">출결 정정</Option>
          <Option value="vacation">휴가</Option>
          <Option value="officialLeave">공가</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="name"
        label={<span css={formLabel}>이름</span>}
        rules={[{ required: true, message: "이름을 입력해주세요" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="date"
        label={
          <span css={formLabel}>
            {getDateLabel(applicationType as ApplicationType)}
          </span>
        }
        rules={[{ required: true, message: "날짜를 선택해주세요" }]}
      >
        <DatePicker css={datePicker} />
      </Form.Item>

      <FileUpload fileList={fileList} handleFileChange={handleFileChange} />

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          css={submitButton}
          disabled={isLoading}
        >
          변환 & 압축
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ApplicationForm;
