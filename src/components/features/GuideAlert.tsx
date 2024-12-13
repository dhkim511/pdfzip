/** @jsxImportSource @emotion/react */
import React from "react";
import { Alert, Typography } from "antd";
import { typographyTextStyle, alertStyle } from "../../styles/custom";

export const GuideAlert: React.FC = () => (
  <Alert
    description={
      <>
        {[
          "증빙서류는 이미지 파일 형식으로 첨부",
          "서명 이미지는 'sign.png'로 첨부",
          "모바일 가능",
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
    css={[alertStyle, { marginTop: "32px", marginBottom: "42px" }]}
  />
);
