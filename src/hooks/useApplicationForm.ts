import { useState } from "react";
import { Form, message } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { FormValues, FileChangeInfo } from "../types/applicationType";
import { createAndDownloadZip } from "../utils/zipArchiver";
import { FEEDBACK_MESSAGES } from "../constants/feedbackMessages";

export const useApplicationForm = () => {
  const [form] = Form.useForm<FormValues>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values: FormValues) => {
    if (fileList.length === 0) {
      message.error(FEEDBACK_MESSAGES.ERRORS.NO_FILE);
      return;
    }

    const files = fileList.map((file) => {
      if (!file.originFileObj) {
        message.error("파일 업로드가 완료되지 않았습니다.");
        throw new Error("파일이 유효하지 않습니다.");
      }
      return file.originFileObj as File;
    });

    setIsLoading(true);
    try {
      await createAndDownloadZip(values, files);
    } catch (error) {
      const errorMessage = (error as Error).message;
      message.error(`${FEEDBACK_MESSAGES.ERRORS.GENERAL_ERROR} - ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (info: FileChangeInfo) => {
    setFileList([...info.fileList]);
  };

  return {
    form,
    fileList,
    isLoading,
    onFinish,
    handleFileChange,
  };
};
