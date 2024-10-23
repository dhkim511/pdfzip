import { useState } from "react";
import { Form, message } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { FormValues, FileChangeInfo } from "../types/conversionType";
import { createAndDownloadZip } from "../utils/zipArchiver";
import { FEEDBACK_MESSAGES } from "../constants/feedbackMessages";
import { SERVER_URL } from "../constants/environmentConfig";

export const useConversionForm = () => {
  const [form] = Form.useForm<FormValues>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [signFile, setSignFile] = useState<UploadFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values: FormValues) => {
    if (fileList.length === 0 && !signFile) {
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
      if (signFile && signFile.originFileObj) {
        const signFormData = new FormData();
        signFormData.append("file", signFile.originFileObj);
        
        const signResponse = await fetch(`${SERVER_URL}/sign`, {
          method: "POST",
          body: signFormData,
        });

        if (!signResponse.ok) {
          throw new Error("서명 파일 업로드 실패");
        }
      }

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
  
  const handleSignFileChange = (info: FileChangeInfo) => {
    setSignFile(info.fileList[0] || null);
  };

  return {
    form,
    fileList,
    signFile,
    isLoading,
    onFinish,
    handleFileChange,
    handleSignFileChange,
  };
};