/** @jsxImportSource @emotion/react */
import React from "react";
import { Form, Input } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { FormLabel } from "../common/Label";
import { flexLayout, halfWidth } from "../../styles/styles";
import { FEEDBACK_MESSAGES } from "../../constants/feedbackMessages";

const { TextArea } = Input;

export const FinalVacation: React.FC = () => (
  <>
    <div css={flexLayout.container}>
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
        css={halfWidth}
      >
        <TextArea rows={1} placeholder="내용 작성" />
      </Form.Item>
      <Form.Item
        name="significant"
        label={<FormLabel icon={<FileTextOutlined />}>특이사항</FormLabel>}
        css={halfWidth}
      >
        <TextArea rows={1} placeholder="없을 시 생략" />
      </Form.Item>
    </div>
    <div css={flexLayout.container}>
      <Form.Item
        name="currentTasks"
        label={
          <FormLabel icon={<FileTextOutlined />}>진행하고 있는 업무</FormLabel>
        }
        rules={[
          {
            required: true,
            message: FEEDBACK_MESSAGES.FORM_VALIDATION.FIELD_REQUIRED,
          },
        ]}
        css={halfWidth}
      >
        <TextArea rows={1} placeholder="자세히 작성" />
      </Form.Item>
      <Form.Item
        name="taskAdjustments"
        label={
          <FormLabel icon={<FileTextOutlined />}>조정 필요한 업무</FormLabel>
        }
        rules={[
          {
            required: true,
            message: FEEDBACK_MESSAGES.FORM_VALIDATION.FIELD_REQUIRED,
          },
        ]}
        css={halfWidth}
      >
        <TextArea rows={1} placeholder="자세히 작성" />
      </Form.Item>
    </div>
    <Form.Item
      name="workPlan"
      label={<FormLabel icon={<FileTextOutlined />}>업무 계획</FormLabel>}
      rules={[
        {
          required: true,
          message: FEEDBACK_MESSAGES.FORM_VALIDATION.FIELD_REQUIRED,
        },
      ]}
    >
      <TextArea rows={1} placeholder="자세히 작성" />
    </Form.Item>
  </>
);
