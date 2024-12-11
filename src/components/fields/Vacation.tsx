/** @jsxImportSource @emotion/react */
import React from "react";
import { Form, Input } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { FormLabel } from "../common/Label";
import { MESSAGES } from "../../constants/messages";
import { useWindowSize } from "../../hooks/useWindowSize";

const { TextArea } = Input;
const MOBILE_BREAKPOINT = 768;

export const Vacation: React.FC = () => {
  const { width } = useWindowSize();
  const textAreaRows = width <= MOBILE_BREAKPOINT ? 4 : 1;

  return (
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
            message: MESSAGES.FORM_VALIDATION.FIELD_REQUIRED,
          },
        ]}
      >
        <TextArea
          rows={textAreaRows}
          placeholder="내용 작성"
          autoSize={{ minRows: textAreaRows }}
        />
      </Form.Item>

      <Form.Item
        name="studyPlan"
        label={
          <FormLabel icon={<FileTextOutlined />}>학습 진행 계획</FormLabel>
        }
        rules={[
          {
            required: true,
            message: MESSAGES.FORM_VALIDATION.FIELD_REQUIRED,
          },
        ]}
      >
        <TextArea
          rows={textAreaRows}
          placeholder="자세히 작성"
          autoSize={{ minRows: textAreaRows }}
        />
      </Form.Item>

      <Form.Item
        name="significant"
        label={<FormLabel icon={<FileTextOutlined />}>특이사항</FormLabel>}
      >
        <TextArea
          rows={textAreaRows}
          placeholder="없을 시 생략"
          autoSize={{ minRows: textAreaRows }}
        />
      </Form.Item>
    </>
  );
};
