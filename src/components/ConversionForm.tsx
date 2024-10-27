/** @jsxImportSource @emotion/react */
import React from "react";
import { Form, Select, Input, DatePicker, Button, FormInstance } from "antd";
import {
  FileTextOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";
import {
  FormValues,
  ConversionType,
  FileChangeInfo,
} from "../types/conversionType";
import FileUpload from "./FileUpload";
import {
  submitButton,
  datePicker,
  flexLayout,
  halfWidth,
} from "../styles/index";
import { getDateLabel } from "../utils/labelHandle";
import { FEEDBACK_MESSAGES } from "../constants/feedbackMessages";
import { FormLabel } from "./Label";

const { Option } = Select;
const { TextArea } = Input;

interface ConversionFormProps {
  form: FormInstance;
  onFinish: (values: FormValues) => void;
  fileList: FormValues["files"];
  handleFileChange: (info: FileChangeInfo) => void;
  isLoading: boolean;
}

const ConversionForm: React.FC<ConversionFormProps> = ({
  form,
  onFinish,
  fileList,
  handleFileChange,
  isLoading,
}) => {
  const conversionType = Form.useWatch("conversionType", form);
  const isVacationType = conversionType === "vacation";
  const isOfficialLeaveType = conversionType === "officialLeave";

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => onFinish(values as FormValues)}
      requiredMark={false}
    >
      <Form.Item
        name="conversionType"
        label={<FormLabel icon={<CheckSquareOutlined />}>신청 유형</FormLabel>}
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
        label={<FormLabel icon={<UserOutlined />}>이름</FormLabel>}
        rules={[
          {
            required: true,
            message: FEEDBACK_MESSAGES.FORM_VALIDATION.NAME_REQUIRED,
          },
        ]}
        style={
          isOfficialLeaveType ? { marginTop: "60px", marginBottom: "74px" } : {}
        }
      >
        <Input placeholder="이름 입력" />
      </Form.Item>

      <Form.Item
        name="date"
        label={
          <FormLabel icon={<CalendarOutlined />}>
            {getDateLabel(conversionType as ConversionType)}
          </FormLabel>
        }
        rules={[
          {
            required: true,
            message: FEEDBACK_MESSAGES.FORM_VALIDATION.DATE_REQUIRED,
          },
        ]}
        style={isOfficialLeaveType ? { marginBottom: "74px" } : {}}
      >
        <DatePicker css={datePicker} />
      </Form.Item>

      {!isVacationType && !isOfficialLeaveType && (
        <>
          <div css={flexLayout.container}>
            <Form.Item
              name="checkInTime"
              label={
                <FormLabel icon={<ClockCircleOutlined />}>입실 시간</FormLabel>
              }
              rules={[
                {
                  required: true,
                  message:
                    FEEDBACK_MESSAGES.FORM_VALIDATION.CHECKIN_TIME_REQUIRED,
                },
              ]}
              css={halfWidth}
            >
              <Input placeholder="ex) 10:00" />
            </Form.Item>

            <Form.Item
              name="checkOutTime"
              label={
                <FormLabel icon={<ClockCircleOutlined />}>퇴실 시간</FormLabel>
              }
              rules={[
                {
                  required: true,
                  message:
                    FEEDBACK_MESSAGES.FORM_VALIDATION.CHECKOUT_TIME_REQUIRED,
                },
              ]}
              css={halfWidth}
            >
              <Input placeholder="ex) 19:00" />
            </Form.Item>
          </div>

          <Form.Item
            name="reason"
            label={<FormLabel icon={<FileTextOutlined />}>사유</FormLabel>}
            rules={[
              {
                required: true,
                message: FEEDBACK_MESSAGES.FORM_VALIDATION.REASON_REQUIRED,
              },
            ]}
          >
            <TextArea
              rows={1}
              placeholder="ex) HRD 오류, 면접, 시험, 질병, 예비군 ..."
            />
          </Form.Item>

          <Form.Item
            name="proofDocumentName"
            label={
              <FormLabel icon={<FileTextOutlined />}>증빙서류명</FormLabel>
            }
          >
            <Input placeholder="ex) 진료확인서, 면접확인서, 예비군 필증..." />
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
                message: FEEDBACK_MESSAGES.FORM_VALIDATION.FIELD_REQUIRED,
              },
            ]}
          >
            <TextArea rows={1} placeholder="내용 작성" />
          </Form.Item>

          <Form.Item
            name="studyPlan"
            label={
              <FormLabel icon={<FileTextOutlined />}>학습 진행 계획</FormLabel>
            }
            rules={[
              {
                required: true,
                message: FEEDBACK_MESSAGES.FORM_VALIDATION.FIELD_REQUIRED,
              },
            ]}
          >
            <TextArea rows={1} placeholder="자세히 작성" />
          </Form.Item>

          <Form.Item
            name="significant"
            label={<FormLabel icon={<FileTextOutlined />}>특이사항</FormLabel>}
          >
            <TextArea rows={1} placeholder="없을 시 생략 가능" />
          </Form.Item>
        </>
      )}

      {isOfficialLeaveType && (
        <Form.Item
          name="proofDocumentName"
          label={<FormLabel icon={<FileTextOutlined />}>증빙서류명</FormLabel>}
          style={{ marginBottom: "74px" }}
        >
          <Input placeholder="ex) 진료확인서, 면접확인서, 예비군 필증..." />
        </Form.Item>
      )}

      <FileUpload
        fileList={fileList}
        handleFileChange={handleFileChange}
        conversionType={conversionType as ConversionType}
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

export default ConversionForm;
