import { FormValues } from "../types/conversionType";
import { SERVER_URL } from "../constants/environment";

const createVacationRequestBody = (values: FormValues) => ({
 conversionType: values.conversionType,
 courseType: values.courseType,
 date: values.date.format(),
 name: values.name,
 courseContent: values.courseContent || "",
 studyPlan: values.conversionType === "vacation" ? values.studyPlan || "" : "",
 significant: values.significant || "",
});

const createConversionFormData = (file: File, values: FormValues) => {
 const formData = new FormData();
 formData.append("file", file);
 formData.append("conversionType", values.conversionType);
 formData.append("courseType", values.courseType);
 formData.append("date", values.date.format());
 formData.append("name", values.name);
 formData.append("checkInTime", values.checkInTime);
 formData.append("checkOutTime", values.checkOutTime);
 formData.append("reason", values.reason);
 formData.append("proofDocumentName", values.proofDocumentName || "");
 return formData;
};

export const convertVacationFiles = async (values: FormValues) => {
 const response = await fetch(`${SERVER_URL}/convert`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify(createVacationRequestBody(values)),
 });

 if (!response.ok) {
   throw new Error(`HTTP error! status: ${response.status}`);
 }

 return await response.json();
};

export const convertFile = async (file: File, values: FormValues) => {
 const response = await fetch(`${SERVER_URL}/convert`, {
   method: "POST",
   body: createConversionFormData(file, values),
 });

 if (!response.ok) {
   throw new Error(`HTTP error! status: ${response.status}`);
 }

 return await response.json();
};

export const uploadSignFile = async (file: File) => {
 const formData = new FormData();
 formData.append("file", file);

 const response = await fetch(`${SERVER_URL}/sign`, {
   method: "POST",
   body: formData,
 });

 if (!response.ok) {
   throw new Error("서명 파일 업로드 실패");
 }

 return await response.json();
};

export const fetchConvertedFile = async (filePath: string) => {
 const response = await fetch(`${SERVER_URL}${filePath}`);
 if (!response.ok) {
   throw new Error(`File fetch error: ${response.status}`);
 }
 return await response.blob();
};