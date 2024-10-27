/** @jsxImportSource @emotion/react */
import React, { useRef } from "react";
import { Form, Button, Typography, Space, Alert } from "antd";
import {
  DownloadOutlined,
  CloudDownloadOutlined,
  EditOutlined,
  SendOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import SignatureCanvas from "react-signature-canvas";
import {
  downloadButton,
  downloadButtonGroup,
  link,
  flexLayout,
  spacing,
  signatureCanvas,
  typographyTextStyle,
  fullWidth,
} from "../styles/index";
import {
  handleSignatureClear,
  handleSignatureDownload,
  handleDownload,
} from "../utils/fileUtils";
import { FormLabel } from "./Label";
import { DOCS, FORMLINK, NOTICELINK } from "../constants/resources";

const { Link } = Typography;

const GuideForm: React.FC = () => {
  const [form] = Form.useForm();
  const signatureRef = useRef<SignatureCanvas>(null);

  return (
    <Form form={form} layout="vertical" css={flexLayout.column}>
      <div css={flexLayout.flex00Auto}>
        <Form.Item
          label={
            <FormLabel icon={<CloudDownloadOutlined />}>
              문서 다운로드
            </FormLabel>
          }
        >
          <div css={downloadButtonGroup}>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(DOCS[0])}
              css={downloadButton}
            >
              출석대장 다운로드
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(DOCS[1])}
              css={downloadButton}
            >
              휴가계획서 다운로드
            </Button>
          </div>
        </Form.Item>

        <Form.Item
          label={<FormLabel icon={<EditOutlined />}>서명</FormLabel>}
          css={spacing.margin.bottom.lg}
        >
          <Space direction="vertical" size="middle" css={fullWidth}>
            <div css={flexLayout.center}>
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{
                  width: 540,
                  height: 200,
                  className: "signature-canvas",
                  style: signatureCanvas,
                }}
              />
            </div>
            <div css={flexLayout.end}>
              <Space>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => handleSignatureDownload(signatureRef)}
                >
                  서명 다운로드
                </Button>
                <Button onClick={() => handleSignatureClear(signatureRef)}>
                  지우기
                </Button>
              </Space>
            </div>
          </Space>
        </Form.Item>

        <div css={[flexLayout.spaceBetween, spacing.margin.bottom.al]}>
          <Form.Item
            label={
              <FormLabel icon={<NotificationOutlined />}>
                행정 관련 공지
              </FormLabel>
            }
            style={{ flex: 1 }}
          >
            <Link href={NOTICELINK} target="_blank" css={link}>
              공지사항 바로가기
            </Link>
          </Form.Item>

          <Form.Item
            label={<FormLabel icon={<SendOutlined />}>제출 폼 링크</FormLabel>}
            style={{ flex: 1 }}
          >
            <Link href={FORMLINK} target="_blank" css={link}>
              제출하러 가기
            </Link>
          </Form.Item>
        </div>
        <Alert
          description={
            <>
              <Typography.Text css={typographyTextStyle}>
                1. HRD 관련 오류는 증빙서류명 작성 생략
              </Typography.Text>
              <br />
              <Typography.Text css={typographyTextStyle}>
                2. 증빙서류는 이미지 파일 형식으로 첨부
              </Typography.Text>
              <br />
              <Typography.Text css={typographyTextStyle}>
                3. 서명 이미지는 'sign.png'로 첨부
              </Typography.Text>
            </>
          }
          type="warning"
          showIcon
        />
      </div>
    </Form>
  );
};

export default GuideForm;
