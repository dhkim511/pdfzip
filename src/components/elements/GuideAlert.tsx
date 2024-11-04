/** @jsxImportSource @emotion/react */
import React from "react";
import { Alert, Typography } from "antd";
import { typographyTextStyle, alertStyle, spacing } from "../../styles/styles";

export const GuideAlert: React.FC = () => (
  <Alert
    description={
      <>
        {[
          "HRD 오류는 증빙서류명 작성 생략",
          "증빙서류는 이미지 파일 형식으로 첨부",
          "서명 이미지는 'sign.png'로 첨부",
          "입력 칸 우측 하단 드래그하여 크기 조절 가능",
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
