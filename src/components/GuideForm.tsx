/** @jsxImportSource @emotion/react */
import React, { useRef } from "react";
import { Tabs, Typography, Button, Alert, Space } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import SignatureCanvas from "react-signature-canvas";
import {
  downloadButton,
  formLabel,
  downloadButtonGroup,
  requiredIcon,
} from "../styles/styles";
import { handleDownload } from "../utils/fileDownload";
import { DOCS } from "../constants/resources";

const { TabPane } = Tabs;
const { Text } = Typography;

const GuideForm: React.FC = () => {
  const signatureRef = useRef<SignatureCanvas>(null);

  const handleSignatureClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  const handleSignatureDownload = () => {
    if (signatureRef.current) {
      const dataURL = signatureRef.current.toDataURL();
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "sign.png";
      link.click();
    }
  };

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="출결 정정" key="1">
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Alert
            description="모든 출결정정 신청은 영업일 기준 다음날 16시까지만 요청 가능"
            type="warning"
            showIcon
          />

          <Space direction="vertical">
            <Text strong>필요 서류:</Text>
            <Text>
              1. HRD 오류 등으로 인한 QR 미체크 출결정정 → 출석대장, 출석
              스크린샷 첨부
            </Text>
            <Text>2. 기타 → 출석대장, 증빙서류 첨부</Text>
          </Space>

          <div>
            <span css={formLabel}>
              <span css={requiredIcon}>*</span>출석대장 다운로드
            </span>
            <div css={downloadButtonGroup}>
              <Button
                icon={<DownloadOutlined />}
                onClick={() => handleDownload(DOCS[0])}
                css={downloadButton}
              >
                출석대장 다운로드
              </Button>
            </div>
          </div>

          <div>
            <span css={formLabel}>
              <span css={requiredIcon}>*</span>서명
            </span>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{
                  width: 500,
                  height: 200,
                  className: "signature-canvas",
                  style: { border: "1px solid #d9d9d9", borderRadius: "2px" },
                }}
              />
              <Space>
                <Button onClick={handleSignatureClear}>초기화</Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleSignatureDownload}
                >
                  서명 다운로드
                </Button>
              </Space>
            </Space>
          </div>
        </Space>
      </TabPane>
      <TabPane tab="휴가" key="2">
        <h3>휴가</h3>
      </TabPane>
      <TabPane tab="공가" key="3">
        <h3>공가</h3>
      </TabPane>
    </Tabs>
  );
};

export default GuideForm;
