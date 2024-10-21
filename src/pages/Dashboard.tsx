/** @jsxImportSource @emotion/react */
import React from "react";
import { Spin } from "antd";
import ApplicationForm from "../components/ApplicationForm";
import GuideForm from "../components/GuideForm";
import { useApplicationForm } from "../hooks/useApplicationForm";
import { FEEDBACK_MESSAGES } from "../constants/feedbackMessages";
import {
  appContainer,
  formContainer,
  leftContainer,
  rightContainer,
  guideSection,
  formSection,
} from "../styles/styles";

const Dashboard: React.FC = () => {
  const {
    form,
    fileList,
    isLoading,
    onFinish,
    handleFileChange,
    handleSignFileChange, // 이 부분을 추가
  } = useApplicationForm();

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
              <ApplicationForm
                form={form}
                onFinish={onFinish}
                fileList={fileList}
                handleFileChange={handleFileChange}
                handleSignFileChange={handleSignFileChange} // 이 부분을 추가
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
