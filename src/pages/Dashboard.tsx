/** @jsxImportSource @emotion/react */
import React from "react";
import { Spin } from "antd";
import ConversionForm from "../components/form/ConversionForm";
import GuideSection from "../components/section/GuideSection";
import { useConversionForm } from "../hooks/useConversionForm";
import { MESSAGES } from "../constants/messages";
import {
  appContainer,
  formContainer,
  leftContainer,
  rightContainer,
  guideSection,
  formSection,
} from "../styles";

const Dashboard: React.FC = () => {
  const { form, fileList, isLoading, onFinish, handleFileChange } =
    useConversionForm();

  return (
    <div css={appContainer}>
      <div css={formContainer}>
        <div css={leftContainer}>
          <div css={guideSection}>
            <GuideSection />
          </div>
        </div>
        <div css={rightContainer}>
          <div css={formSection}>
            <Spin spinning={isLoading} tip={MESSAGES.STATUS.LOADING}>
              <ConversionForm
                form={form}
                onFinish={onFinish}
                fileList={fileList}
                handleFileChange={handleFileChange}
                isLoading={isLoading}
              />
            </Spin>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
