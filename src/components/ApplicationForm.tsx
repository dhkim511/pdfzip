/** @jsxImportSource @emotion/react */
import React from "react";
import {
  Form,
  Select,
  Input,
  DatePicker,
  Button,
  FormInstance,
  Typography,
  Space,
} from "antd";
import {
  FormOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import {
  FormValues,
  ApplicationType,
  FileChangeInfo,
} from "../types/applicationType";
import FileUpload from "./FileUpload";
import { submitButton, datePicker } from "../styles/styles";
import { getDateLabel } from "../utils/labelHandle";
import { FEEDBACK_MESSAGES } from "../constants/feedbackMessages";

const { Option } = Select;
const { Text } = Typography;
const { TextArea } = Input;

interface ApplicationFormProps {
  form: FormInstance;
  onFinish: (values: FormValues) => void;
  fileList: FormValues["files"];
  handleFileChange: (info: FileChangeInfo) => void;
  handleSignFileChange: (info: FileChangeInfo) => void;
  isLoading: boolean;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  form,
  onFinish,
  fileList,
  handleFileChange,
  handleSignFileChange,
  isLoading,
}) => {
  const applicationType = Form.useWatch("applicationType", form);

  const isVacationType = applicationType === "vacation";

  const handleFormSubmit = (values: FormValues) => {
    if (isVacationType) {
      values.checkInTime = "10:00";
      values.checkOutTime = "19:00";
      values.reason = "휴가";
    }
    onFinish(values);
  };

  const FormLabel = ({
    icon,
    children,
  }: {
    icon: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <Space size={4}>
      {React.cloneElement(icon as React.ReactElement, {
        style: { fontSize: "16px", color: "#595959" },
      })}
      <Text strong style={{ color: "#595959" }}>
        {children}
      </Text>
    </Space>
  );

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFormSubmit}
      requiredMark={false}
    >
      <Form.Item
        name="applicationType"
        label={<FormLabel icon={<FormOutlined />}>신청 유형</FormLabel>}
        initialValue="attendance"
        rules={[
          {
            required: true,
            message:
              FEEDBACK_MESSAGES.FORM_VALIDATION.APPLICATION_TYPE_REQUIRED,
          },
        ]}
      >
        <Select>
          <Option value="attendance">출결 정정</Option>
          <Option value="vacation">휴가</Option>
          <Option value="officialLeave">공가</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="name"
        label={<FormLabel icon={<FormOutlined />}>이름</FormLabel>}
        rules={[
          {
            required: true,
            message: FEEDBACK_MESSAGES.FORM_VALIDATION.NAME_REQUIRED,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="date"
        label={
          <FormLabel icon={<CalendarOutlined />}>
            {getDateLabel(applicationType as ApplicationType)}
          </FormLabel>
        }
        rules={[
          {
            required: true,
            message: FEEDBACK_MESSAGES.FORM_VALIDATION.DATE_REQUIRED,
          },
        ]}
      >
        <DatePicker css={datePicker} />
      </Form.Item>

      {!isVacationType && (
        <>
          <div css={{ display: "flex", gap: "16px" }}>
            <Form.Item
              name="checkInTime"
              label={
                <FormLabel icon={<ClockCircleOutlined />}>입실 시간</FormLabel>
              }
              rules={[{ required: true, message: "입실 시간을 입력해주세요." }]}
              css={{ flex: 1 }}
            >
              <Input placeholder="ex) 10:00" />
            </Form.Item>

            <Form.Item
              name="checkOutTime"
              label={
                <FormLabel icon={<ClockCircleOutlined />}>퇴실 시간</FormLabel>
              }
              rules={[{ required: true, message: "퇴실 시간을 입력해주세요." }]}
              css={{ flex: 1 }}
            >
              <Input placeholder="ex) 19:00" />
            </Form.Item>
          </div>

          <Form.Item
            name="reason"
            label={<FormLabel icon={<FileTextOutlined />}>사유</FormLabel>}
            rules={[{ required: true, message: "사유를 입력해주세요." }]}
          >
            <TextArea rows={1} placeholder="사유를 입력해주세요." />
          </Form.Item>
        </>
      )}

      {isVacationType && (
        <>
          <Form.Item
            name="courseContent"
            label={
              <FormLabel icon={<FileTextOutlined />}>
                불참하는 과정 교육내용
              </FormLabel>
            }
            rules={[
              {
                required: true,
                message: "불참하는 과정 교육내용을 입력해주세요.",
              },
            ]}
          >
            <TextArea
              rows={3}
              placeholder="불참하는 과정 교육내용을 입력해주세요."
            />
          </Form.Item>

          <Form.Item
            name="studyPlan"
            label={
              <FormLabel icon={<FileTextOutlined />}>학습 진행 계획</FormLabel>
            }
            rules={[
              { required: true, message: "학습 진행 계획을 입력해주세요." },
            ]}
          >
            <TextArea rows={3} placeholder="학습 진행 계획을 입력해주세요." />
          </Form.Item>

          <Form.Item
            name="significant"
            label={<FormLabel icon={<FileTextOutlined />}>특이사항</FormLabel>}
          >
            <TextArea rows={2} placeholder="특이사항을 입력해주세요." />
          </Form.Item>
        </>
      )}

      <FileUpload
        fileList={fileList}
        handleFileChange={handleFileChange}
        handleSignFileChange={handleSignFileChange}
        applicationType={applicationType as ApplicationType}
      />

      <Form.Item>
        <Button
          type="default"
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
