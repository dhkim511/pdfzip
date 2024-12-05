/** @jsxImportSource @emotion/react */
import React, { useRef } from "react";
import { Form } from "antd";
import SignatureCanvas from "react-signature-canvas";
import { flexLayout } from "../../styles";
import { Signature } from "../features/Signature";
import { GuideAlert } from "../features/GuideAlert";
import { ResourceLink } from "../features/ResourceLink";

const GuideSection: React.FC = () => {
  const [form] = Form.useForm();
  const signatureRef = useRef<SignatureCanvas>(null);

  return (
    <Form form={form} layout="vertical" css={flexLayout.column}>
      <div css={flexLayout.flex00Auto}>
        <GuideAlert />
        <Signature signatureRef={signatureRef} />
        <ResourceLink />
      </div>
    </Form>
  );
};

export default GuideSection;
