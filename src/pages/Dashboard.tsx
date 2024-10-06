/** @jsxImportSource @emotion/react */
import React from "react";
import { Spin } from "antd";
import ApplicationForm from "../components/ApplicationForm";
import { useApplicationForm } from "../hooks/useApplicationForm";
import { LOADING_MESSAGE } from "../constants/messages";
import { appContainer, formContainer } from "../styles/styles";

const Dashboard: React.FC = () => {
  const { form, fileList, isLoading, onFinish, handleFileChange } =
    useApplicationForm();

  return (
    <div css={appContainer}>
      <div css={formContainer}>
        <Spin spinning={isLoading} tip={LOADING_MESSAGE}>
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
