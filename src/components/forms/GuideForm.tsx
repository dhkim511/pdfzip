/** @jsxImportSource @emotion/react */
import React, { useRef } from "react";
import { Form } from "antd";
import SignatureCanvas from "react-signature-canvas";
import { flexLayout } from "../../styles/styles";
import { Signature } from "../elements/Signature";
import { GuideAlert } from "../elements/GuideAlert";
import { FormLinks } from "../elements/FormLinks";

const GuideForm: React.FC = () => {
  const [form] = Form.useForm();
  const signatureRef = useRef<SignatureCanvas>(null);

  return (
    <Form form={form} layout="vertical" css={flexLayout.column}>
      <div css={flexLayout.flex00Auto}>
        <GuideAlert />
        <Signature signatureRef={signatureRef} />
        <FormLinks />
      </div>
    </Form>
  );
};

export default GuideForm;
