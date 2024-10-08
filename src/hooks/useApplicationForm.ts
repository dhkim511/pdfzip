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

    setIsLoading(true);
    try {
      await createAndDownloadZip(
        values,
        fileList.map((file) => file.originFileObj as File)
      );
    } catch (error) {
      message.error(FEEDBACK_MESSAGES.ERRORS.GENERAL_ERROR);
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