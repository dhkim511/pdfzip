import { useState } from "react";
import { Form, message } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { FormValues, FileChangeInfo } from "../types/conversionType";
import { createAndDownloadZip } from "../utils/zipArchiver";
import { MESSAGES } from "../constants/messages";
import { SERVER_URL } from "../constants/environment";

interface ProcessResult {
 ok: boolean;
 error?: string;
}

export const useConversionForm = () => {
 const [form] = Form.useForm<FormValues>();
 const [fileList, setFileList] = useState<UploadFile[]>([]);
 const [isLoading, setIsLoading] = useState(false);

 const validateFiles = (files: File[]): ProcessResult => {
   if (files.length === 0) {
     return { ok: false, error: MESSAGES.ERRORS.NO_FILE };
   }
   return { ok: true };
 };

 const uploadSignature = async (file: File): Promise<ProcessResult> => {
   const formData = new FormData();
   formData.append("file", file);

   try {
     const response = await fetch(`${SERVER_URL}/sign`, {
       method: "POST",
       body: formData,
     });

     return {
       ok: response.ok,
       error: response.ok ? undefined : "서명 파일 업로드 실패",
     };
   } catch (error) {
     return { ok: false, error: "서명 파일 업로드 실패" };
   }
 };

 const processFiles = async (values: FormValues): Promise<ProcessResult> => {
   const files = fileList.map((file) => {
     if (!file.originFileObj) {
       throw new Error("파일이 유효하지 않습니다.");
     }
     return file.originFileObj as File;
   });

   const validation = validateFiles(files);
   if (!validation.ok) return validation;

   const signFile = files.find((file) => 
     file.name.toLowerCase().includes("sign")
   );

   if (signFile) {
     const signResult = await uploadSignature(signFile);
     if (!signResult.ok) return signResult;
   }

   const otherFiles = files.filter(
     (file) => !file.name.toLowerCase().includes("sign")
   );

   try {
     await createAndDownloadZip(values, otherFiles);
     return { ok: true };
   } catch (error) {
     return { 
       ok: false, 
       error: `${MESSAGES.ERRORS.GENERAL_ERROR} - ${(error as Error).message}`
     };
   }
 };

 const onFinish = async (values: FormValues) => {
   setIsLoading(true);
   try {
     const result = await processFiles(values);
     if (!result.ok && result.error) {
       message.error(result.error);
     }
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