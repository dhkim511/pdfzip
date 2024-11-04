import React from "react";
import { Form, Input } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { FormLabel } from "../common/Label";
import { FEEDBACK_MESSAGES } from "../../constants/feedbackMessages";

const { TextArea } = Input;

export const Vacation: React.FC = () => (
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
      label={<FormLabel icon={<FileTextOutlined />}>학습 진행 계획</FormLabel>}
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
      <TextArea rows={1} placeholder="없을 시 생략" />
    </Form.Item>
  </>
);
