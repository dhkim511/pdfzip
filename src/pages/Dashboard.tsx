/** @jsxImportSource @emotion/react */
import React from "react";
import { Spin } from "antd";
import ApplicationForm from "../components/ApplicationForm";
import LinkForm from "../components/LinkForm";
import GuideForm from "../components/GuideForm";
import { useApplicationForm } from "../hooks/useApplicationForm";
import { FEEDBACK_MESSAGES } from "../constants/feedbackMessages";
import {
  appContainer,
  formContainer,
  leftContainer,
  rightContainer,
  guideSection,
  linkSection,
  formSection,
} from "../styles/styles";

const Dashboard: React.FC = () => {
  const { form, fileList, isLoading, onFinish, handleFileChange } =
    useApplicationForm();

  return (
    <div css={appContainer}>
      <div css={formContainer}>
        <div css={leftContainer}>
          <div css={guideSection}>
            <GuideForm />
          </div>
        </div>
        <div css={rightContainer}>
          <div css={linkSection}>
            <LinkForm />
          </div>
          <div css={formSection}>
            <Spin spinning={isLoading} tip={FEEDBACK_MESSAGES.STATUS.LOADING}>
              <ApplicationForm
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
