/** @jsxImportSource @emotion/react */
import React from "react";
import { Alert, Typography } from "antd";
import { typographyTextStyle, alertStyle } from "../../styles/custom";
import { MESSAGES } from "../../constants/messages";

export const GuideAlert: React.FC = () => (
  <Alert
    description={
      <>
        {MESSAGES.GUIDE.DESCRIPTIONS.map((text, index) => (
          <Typography.Text key={index} css={typographyTextStyle}>
            {`${index + 1}. ${text}`}
            <br />
          </Typography.Text>
        ))}
      </>
    }
    type="warning"
    showIcon
    css={[alertStyle, { marginTop: "32px", marginBottom: "42px" }]}
  />
);
