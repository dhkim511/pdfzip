/** @jsxImportSource @emotion/react */
import React from "react";
import { Form, Select, Input, DatePicker, Button, FormInstance } from "antd";
import {
  FormValues,
  ApplicationType,
  FileChangeInfo,
} from "../types/applicationType";
import FileUpload from "./FileUpload";
import {
  formLabel,
  submitButton,
  datePicker,
  requiredIcon,
} from "../styles/styles";
import { getDateLabel } from "../utils/labelHandle";
import { FEEDBACK_MESSAGES } from "../constants/feedbackMessages";

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
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
    >
      <Form.Item
        name="applicationType"
        label={
          <span css={formLabel}>
            <span css={requiredIcon}>*</span>
            신청 유형
          </span>
        }
        initialValue="attendance"
        rules={[{ required: true, message: FEEDBACK_MESSAGES.FORM_VALIDATION.APPLICATION_TYPE_REQUIRED }]}
      >
        <Select>
          <Option value="attendance">출결 정정</Option>
          <Option value="vacation">휴가</Option>
          <Option value="officialLeave">공가</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="name"
        label={
          <span css={formLabel}>
            <span css={requiredIcon}>*</span>
            이름
          </span>
        }
        rules={[{ required: true, message: FEEDBACK_MESSAGES.FORM_VALIDATION.NAME_REQUIRED }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="date"
        label={
          <span css={formLabel}>
            <span css={requiredIcon}>*</span>
            {getDateLabel(applicationType as ApplicationType)}
          </span>
        }
        rules={[{ required: true, message: FEEDBACK_MESSAGES.FORM_VALIDATION.DATE_REQUIRED }]}
      >
        <DatePicker css={datePicker} format="MM/DD" />
      </Form.Item>

      <Form.Item
        name="checkInTime"
        label={
          <span css={formLabel}>
            입실 시간
          </span>
        }
        rules={[{ required: true, message: "입실 시간을 입력해주세요." }]}
      >
        <Input placeholder="ex) 10:00" />
      </Form.Item>

      <Form.Item
        name="checkOutTime"
        label={
          <span css={formLabel}>
            퇴실 시간
          </span>
        }
        rules={[{ required: true, message: "퇴실 시간을 입력해주세요." }]}
      >
        <Input placeholder="ex) 19:00" />
      </Form.Item>

      <Form.Item
        name="reason"
        label={
          <span css={formLabel}>
            사유
          </span>
        }
        rules={[{ required: true, message: "사유를 입력해주세요." }]}
      >
        <Input.TextArea rows={4} placeholder="사유를 입력해주세요." />
      </Form.Item>

      <FileUpload 
        fileList={fileList} 
        handleFileChange={handleFileChange} 
        applicationType={applicationType as ApplicationType} 
      />
      
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
