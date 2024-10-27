/** @jsxImportSource @emotion/react */
import React, { useRef } from "react";
import { Form, Button, Typography, Space, Alert } from "antd";
import {
  DownloadOutlined,
  CloudDownloadOutlined,
  EditOutlined,
  SendOutlined,
  NotificationOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import SignatureCanvas from "react-signature-canvas";
import {
  downloadButton,
  buttonGroup,
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
          <div css={buttonGroup}>
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

        <Form.Item label={<FormLabel icon={<EditOutlined />}>서명</FormLabel>}>
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
          css={spacing.margin.bottom.lg}
        />

        <div css={flexLayout.flex00Auto}>
          <Form.Item
            label={<FormLabel icon={<LinkOutlined />}>링크</FormLabel>}
          >
            <div css={buttonGroup}>
              <Button
                href={NOTICELINK}
                target="_blank"
                css={downloadButton}
                icon={<NotificationOutlined />}
              >
                행정 관련 공지
              </Button>

              <Button
                href={FORMLINK}
                target="_blank"
                css={downloadButton}
                icon={<SendOutlined />}
              >
                제출 폼
              </Button>
            </div>
          </Form.Item>
        </div>
      </div>
    </Form>
  );
};

export default GuideForm;
