/** @jsxImportSource @emotion/react */
import React, { useRef } from "react";
import { Form, Button, Typography, Space, Alert } from "antd";
import {
  DownloadOutlined,
  EditOutlined,
  RedoOutlined,
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
  alertStyle,
} from "../styles/index";
import {
  handleSignatureClear,
  handleSignatureDownload,
} from "../utils/signature";
import { FormLabel } from "./Label";
import { FORMLINK, NOTICELINK } from "../constants/resources";

const GuideForm: React.FC = () => {
  const [form] = Form.useForm();
  const signatureRef = useRef<SignatureCanvas>(null);

  const renderSignatureField = () => (
    <Form.Item label={<FormLabel icon={<EditOutlined />}>서명</FormLabel>}>
      <Space
        direction="vertical"
        size="middle"
        css={[fullWidth, { marginBottom: spacing.sm }]}
      >
        <div css={flexLayout.center}>
          <SignatureCanvas
            ref={signatureRef}
            canvasProps={{
              width: 480,
              height: 240,
              className: "signature-canvas",
              style: signatureCanvas,
            }}
          />
        </div>
        <div css={[flexLayout.end, fullWidth]}>
          <Space wrap>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => handleSignatureDownload(signatureRef)}
            >
              서명 다운로드
            </Button>
            <Button
              icon={<RedoOutlined />}
              onClick={() => handleSignatureClear(signatureRef)}
            >
              초기화
            </Button>
          </Space>
        </div>
      </Space>
    </Form.Item>
  );

  const renderGuidelinesAlert = () => (
    <Alert
      description={
        <>
          {[
            "HRD 오류는 증빙서류명 작성 생략",
            "증빙서류는 이미지 파일 형식으로 첨부",
            "서명 이미지는 'sign.png'로 첨부",
            "텍스트 입력 칸 우측 하단 드래그하여 크기 조절 가능",
          ].map((text, index) => (
            <Typography.Text key={index} css={typographyTextStyle}>
              {`${index + 1}. ${text}`}
              <br />
            </Typography.Text>
          ))}
        </>
      }
      type="warning"
      showIcon
      css={[alertStyle, { marginBottom: spacing.lg }]}
    />
  );

  const renderLinks = () => (
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

  return (
    <Form form={form} layout="vertical" css={flexLayout.column}>
      <div css={flexLayout.flex00Auto}>
        {renderGuidelinesAlert()}
        {renderSignatureField()}
        {renderLinks()}
      </div>
    </Form>
  );
};

export default GuideForm;
