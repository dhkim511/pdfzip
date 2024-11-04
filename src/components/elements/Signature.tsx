/** @jsxImportSource @emotion/react */
import React, { RefObject } from "react";
import { Form, Button, Space } from "antd";
import {
  EditOutlined,
  DownloadOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import SignatureCanvas from "react-signature-canvas";
import { FormLabel } from "../common/Label";
import {
  flexLayout,
  spacing,
  signatureCanvas,
  fullWidth,
} from "../../styles/styles";

interface SignatureProps {
  signatureRef: RefObject<SignatureCanvas>;
}

export const Signature: React.FC<SignatureProps> = ({ signatureRef }) => {
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
    <Form.Item label={<FormLabel icon={<EditOutlined />}>서명</FormLabel>}>
      <Space
        direction="vertical"
        size="middle"
        css={[fullWidth, { marginBottom: spacing.sm }]}
      >
        <div css={[flexLayout.center, { height: 240, width: "100%" }]}>
          <SignatureCanvas
            ref={signatureRef}
            canvasProps={{
              width: 480,
              height: 240,
              className: "signature-canvas",
              style: {
                ...signatureCanvas,
                touchAction: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
                userSelect: "none",
                width: "100%",
                height: "100%",
              },
            }}
            dotSize={0.5}
            minWidth={0.5}
            maxWidth={2.5}
            throttle={16}
            velocityFilterWeight={0.7}
          />
        </div>
        <div css={[flexLayout.end, fullWidth]}>
          <Space wrap>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleSignatureDownload}
            >
              서명 다운로드
            </Button>
            <Button icon={<RedoOutlined />} onClick={handleSignatureClear}>
              초기화
            </Button>
          </Space>
        </div>
      </Space>
    </Form.Item>
  );
};
