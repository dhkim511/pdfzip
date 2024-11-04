/** @jsxImportSource @emotion/react */
import React from "react";
import { Form, Input } from "antd";
import { ClockCircleOutlined, FileTextOutlined } from "@ant-design/icons";
import { FormLabel } from "../common/Label";
import { flexLayout, halfWidth } from "../../styles/styles";
import { FEEDBACK_MESSAGES } from "../../constants/feedbackMessages";

export const Attendance: React.FC = () => (
  <>
    <div css={flexLayout.container}>
      <Form.Item
        name="checkInTime"
        label={<FormLabel icon={<ClockCircleOutlined />}>입실 시간</FormLabel>}
        rules={[
          {
            required: true,
            message: FEEDBACK_MESSAGES.FORM_VALIDATION.CHECKIN_TIME_REQUIRED,
          },
        ]}
        css={halfWidth}
      >
        <Input placeholder="ex) 10:00" />
      </Form.Item>

      <Form.Item
        name="checkOutTime"
        label={<FormLabel icon={<ClockCircleOutlined />}>퇴실 시간</FormLabel>}
        rules={[
          {
            required: true,
            message: FEEDBACK_MESSAGES.FORM_VALIDATION.CHECKOUT_TIME_REQUIRED,
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
      <Input placeholder="ex) HRD 오류, 질병,  면접, 예비군 ..." />
    </Form.Item>

    <Form.Item
      name="proofDocumentName"
      label={<FormLabel icon={<FileTextOutlined />}>증빙서류명</FormLabel>}
      rules={[
        {
          required: true,
          message:
            FEEDBACK_MESSAGES.FORM_VALIDATION.PROOF_DOCUMENT_NAME_REQUIRED,
        },
      ]}
    >
      <Input placeholder="ex) HRD 오류 화면, 진료확인서, 면접확인서, 예비군 필증..." />
    </Form.Item>
  </>
);
