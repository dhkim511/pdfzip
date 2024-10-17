/** @jsxImportSource @emotion/react */
import React from "react";
import { Form, Tabs } from "antd";

const { TabPane } = Tabs;

const GuideForm: React.FC = () => {
  const [form] = Form.useForm();

  return (
    <Form form={form}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="출결정정" key="1">
          <h3>출결 정정</h3>
        </TabPane>
        <TabPane tab="휴가" key="2">
          <h3>휴가</h3>
        </TabPane>
        <TabPane tab="공가" key="3">
          <h3>공가</h3>
        </TabPane>
      </Tabs>
    </Form>
  );
};

export default GuideForm;
