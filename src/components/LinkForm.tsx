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
            onClick={() =>
              handleDownload(
                "데브캠프 프론트엔드 개발_1기(DEV_FE1) 출석대장.docx"
              )
            }
            css={downloadButton}
          >
            출석대장 다운로드
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={() =>
              handleDownload(
                "[KDT] 휴가 사용 계획서_김패캠의 사본 - (시트 복제 후 사용)상담일자_휴가사용일자.docx"
              )
            }
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
          href="https://docs.google.com/forms/d/e/1FAIpQLSd3sIQywt59-md5533dq52sWRubzCE09VdGNWaxtLWANGM0oQ/viewform"
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
