/** @jsxImportSource @emotion/react */
import React from "react";
import { Spin } from "antd";
import ApplicationForm from "../components/ApplicationForm";
import LinkForm from "../components/LinkForm";
import { useApplicationForm } from "../hooks/useApplicationForm";
import { FEEDBACK_MESSAGES } from "../constants/feedbackMessages";
import { appContainer, formContainer } from "../styles/styles";

const Dashboard: React.FC = () => {
  const { form, fileList, isLoading, onFinish, handleFileChange } =
    useApplicationForm();

  return (
    <div css={appContainer}>
      <div css={formContainer}>
        <LinkForm />
      </div>
      <div css={formContainer}>
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
  );
};

export default Dashboard;