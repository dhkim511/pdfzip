import React from "react";
import { Form, Input } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { FormLabel } from "../common/Label";

export const OfficialLeave: React.FC = () => (
  <Form.Item
    name="proofDocumentName"
    label={<FormLabel icon={<FileTextOutlined />}>증빙서류명</FormLabel>}
  >
    <Input placeholder="ex) 진료확인서, 면접확인서, 예비군 필증..." />
  </Form.Item>
);
