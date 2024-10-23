/** @jsxImportSource @emotion/react */
import React, { useRef } from "react";
import { Form, Button, Typography, Space } from "antd";
import {
  DownloadOutlined,
  CloudDownloadOutlined,
  EditOutlined,
  SendOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import SignatureCanvas from "react-signature-canvas";
import { downloadButton, downloadButtonGroup, link } from "../styles/styles";
import { handleDownload } from "../utils/fileDownload";
import {
  handleSignatureClear,
  handleSignatureDownload,
} from "../utils/signatureHandle";
import { FormLabel } from "./Label";
import { DOCS, FORMLINK } from "../constants/resources";

const { Link } = Typography;

const GuideForm: React.FC = () => {
  const [form] = Form.useForm();
  const signatureRef = useRef<SignatureCanvas>(null);

  return (
    <Form
      form={form}
      layout="vertical"
      css={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "0 0 20px 0",
      }}
    >
      <div css={{ flex: "0 0 auto" }}>
        <Form.Item
          label={
            <FormLabel icon={<CloudDownloadOutlined />}>
              문서 다운로드
            </FormLabel>
          }
          css={{ marginBottom: "60px" }}
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
          css={{ marginBottom: "60px" }}
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div css={{ display: "flex", justifyContent: "center" }}>
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{
                  width: 550,
                  height: 200,
                  className: "signature-canvas",
                  style: { border: "1px solid #d9d9d9", borderRadius: "6px" },
                }}
              />
            </div>
            <div css={{ display: "flex", justifyContent: "flex-end" }}>
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

        <Form.Item
          label={
            <FormLabel icon={<NotificationOutlined />}>
              행정 관련 공지
            </FormLabel>
          }
          css={{ marginBottom: "40px" }}
        >
          <Link
            href="https://sincere-nova-ec6.notion.site/K-Digital-Training-cc413bab49664fa9a0bcbddb18a1e219"
            target="_blank"
            css={link}
          >
            공지사항 바로가기
          </Link>
        </Form.Item>

        <Form.Item
          label={<FormLabel icon={<SendOutlined />}>제출 폼 링크</FormLabel>}
        >
          <Link href={FORMLINK} target="_blank" css={link}>
            제출하러 가기
          </Link>
        </Form.Item>
      </div>
    </Form>
  );
};

export default GuideForm;
