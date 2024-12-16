/** @jsxImportSource @emotion/react */
import React, { RefObject, useEffect, useState, CSSProperties } from "react";
import { Form, Button, Space } from "antd";
import {
  EditOutlined,
  DownloadOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import SignatureCanvas from "react-signature-canvas";
import { FormLabel } from "../common/Label";
import { flexLayout, fullWidth } from "../../styles/layout";
import { signatureContainer } from "../../styles/custom";

interface SignatureProps {
  signatureRef: RefObject<SignatureCanvas>;
}

const canvasStyle: CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  touchAction: "none",
  WebkitUserSelect: "none",
  MozUserSelect: "none",
  msUserSelect: "none",
  userSelect: "none",
  display: "block",
};

export const Signature: React.FC<SignatureProps> = ({ signatureRef }) => {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setCanvasSize({
          width: Math.floor(width),
          height: Math.floor(height),
        });
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

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
    <Form.Item
      label={<FormLabel icon={<EditOutlined />}>서명</FormLabel>}
      css={{ marginBottom: "92px" }}
    >
      <Space direction="vertical" size="middle" css={[fullWidth]}>
        <div ref={containerRef} css={[flexLayout.center, signatureContainer]}>
          {canvasSize.width > 0 && canvasSize.height > 0 && (
            <SignatureCanvas
              ref={signatureRef}
              canvasProps={{
                width: canvasSize.width,
                height: canvasSize.height,
                className: "signature-canvas",
                style: canvasStyle,
              }}
              dotSize={2}
              minWidth={2}
              maxWidth={4}
              throttle={0}
              velocityFilterWeight={0.5}
            />
          )}
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
