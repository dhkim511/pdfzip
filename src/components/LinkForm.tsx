/** @jsxImportSource @emotion/react */
import React from "react";
import { Form, Button, Typography } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import {
  downloadButton,
  formLabel,
  downloadButtonGroup,
  requiredIcon,
  link,
} from "../styles/styles";
import { handleDownload } from "../utils/fileDownload";
import { RESOURCES } from "../constants/resources";

const { Link } = Typography;

const LinkForm: React.FC = () => {
  const [form] = Form.useForm();

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label={
          <span css={formLabel}>
            <span css={requiredIcon}>*</span>
            문서 다운로드
          </span>
        }
      >
        <div css={downloadButtonGroup}>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(RESOURCES.DOCS.ATTENDANCE_SHEET)}
            css={downloadButton}
          >
            출석대장 다운로드
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(RESOURCES.DOCS.VACATION_PLAN)}
            css={downloadButton}
          >
            휴가계획서 다운로드
          </Button>
        </div>
      </Form.Item>

      <Form.Item
        label={
          <span css={formLabel}>
            <span css={requiredIcon}>*</span>
            제출 폼 링크
          </span>
        }
      >
        <Link
          href={RESOURCES.LINKS.SUBMISSION_FORM}
          target="_blank"
          css={link}
        >
          제출하러 가기
        </Link>
      </Form.Item>
    </Form>
  );
};

export default LinkForm;