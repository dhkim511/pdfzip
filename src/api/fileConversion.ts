import { FormValues } from "../types/conversionType";
import { SERVER_URL } from "../constants/environmentConfig";

export const convertVacationFiles = async (values: FormValues) => {
  const response = await fetch(`${SERVER_URL}/convert`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      conversionType: values.conversionType,
      date: values.date.format(),
      name: values.name,
      courseContent: values.courseContent || "",
      studyPlan: values.studyPlan || "",
      significant: values.significant || "",
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

export const convertFile = async (file: File, values: FormValues) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("conversionType", values.conversionType);
  formData.append("date", values.date.format());
  formData.append("name", values.name);
  formData.append("checkInTime", values.checkInTime);
  formData.append("checkOutTime", values.checkOutTime);
  formData.append("reason", values.reason);
  formData.append("proofDocumentName", values.proofDocumentName || "");

  const response = await fetch(`${SERVER_URL}/convert`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
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