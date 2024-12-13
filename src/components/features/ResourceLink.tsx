/** @jsxImportSource @emotion/react */
import React from "react";
import { Form, Button } from "antd";
import {
  NotificationOutlined,
  SendOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { FormLabel } from "../common/Label";
import { buttonGroup, downloadButton } from "../../styles/custom";
import { FORMLINK, NOTICELINK } from "../../constants/resources";

export const ResourceLink: React.FC = () => (
  <Form.Item label={<FormLabel icon={<LinkOutlined />}>링크</FormLabel>}>
    <div css={buttonGroup}>
      <Button
        href={NOTICELINK}
        target="_blank"
        css={downloadButton}
        icon={<NotificationOutlined />}
      >
        공지사항
      </Button>
      <Button
        href={FORMLINK}
        target="_blank"
        css={downloadButton}
        icon={<SendOutlined />}
      >
        제출하기
      </Button>
    </div>
  </Form.Item>
);
