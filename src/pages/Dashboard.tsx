/** @jsxImportSource @emotion/react */
import React from "react";
import { Spin } from "antd";
import ConversionForm from "../components/ConversionForm";
import GuideForm from "../components/GuideForm";
import { useConversionForm } from "../hooks/useConversionForm";
import { FEEDBACK_MESSAGES } from "../constants/feedbackMessages";
import {
  appContainer,
  formContainer,
  leftContainer,
  rightContainer,
  guideSection,
  formSection,
} from "../styles/index";

const Dashboard: React.FC = () => {
  const {
    form,
    fileList,
    isLoading,
    onFinish,
    handleFileChange,
    handleSignFileChange,
  } = useConversionForm();

  return (
    <div css={appContainer}>
      <div css={formContainer}>
        <div css={leftContainer}>
          <div css={guideSection}>
            <GuideForm />
          </div>
        </div>
        <div css={rightContainer}>
          <div css={formSection}>
            <Spin spinning={isLoading} tip={FEEDBACK_MESSAGES.STATUS.LOADING}>
              <ConversionForm
                form={form}
                onFinish={onFinish}
                fileList={fileList}
                handleFileChange={handleFileChange}
                handleSignFileChange={handleSignFileChange}
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
