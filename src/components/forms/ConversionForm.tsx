/** @jsxImportSource @emotion/react */
import React from "react";
import { Form, Select, Input, DatePicker, Button, FormInstance } from "antd";
import {
  UserOutlined,
  CheckSquareOutlined,
  CalendarOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import {
  FormValues,
  ConversionType,
  FileChangeInfo,
} from "../../types/conversionType";
import FileUpload from "../elements/FileUpload";
import { submitButton, datePicker } from "../../styles/styles";
import { getDateLabel } from "../../utils/labelHandle";
import { FEEDBACK_MESSAGES } from "../../constants/feedbackMessages";
import { FormLabel } from "../common/Label";
import { Attendance } from "../fields/Attendance";
import { Vacation } from "../fields/Vacation";
import { FinalVacation } from "../fields/FinalVacation";
import { OfficialLeave } from "../fields/OfficialLeave";

const { Option } = Select;

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

  const renderFields = () => {
    switch (conversionType) {
      case "attendance":
        return <Attendance />;
      case "vacation":
        return <Vacation />;
      case "finalVacation":
        return <FinalVacation />;
      case "officialLeave":
        return <OfficialLeave />;
      default:
        return null;
    }
  };

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
          <Option value="finalVacation">휴가 (파이널 프로젝트 기간)</Option>
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
          conversionType === "officialLeave"
            ? { marginTop: "60px", marginBottom: "74px" }
            : {}
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
        style={
          conversionType === "officialLeave" ? { marginBottom: "74px" } : {}
        }
      >
        <DatePicker css={datePicker} />
      </Form.Item>

      {renderFields()}

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
          icon={<DownloadOutlined />}
        >
          신청파일 다운로드
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ConversionForm;
