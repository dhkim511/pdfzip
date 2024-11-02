import { FormValues } from "../types/conversionType";

export const isAttendanceScreenshot = (fileName: string): boolean => {
  const lowerFileName = fileName.toLowerCase();
  return (
    (lowerFileName.includes("오전") || lowerFileName.includes("오후")) &&
    (lowerFileName.includes("10") ||
      lowerFileName.includes("2") ||
      lowerFileName.includes("7"))
  );
};

const getProofDocumentSuffix = (
  fileName: string, 
  proofDocumentName?: string
): string => {
  if (fileName.toLowerCase().includes("출석대장")) {
    return "(출석대장)";
  }
  if (proofDocumentName) {
    return `(${proofDocumentName})`;
  }
  return "(증빙서류)";
};

export const getSuffix = (
  fileName: string,
  proofDocumentName?: string
): string => {
  if (isAttendanceScreenshot(fileName)) {
    return "";
  }

  return getProofDocumentSuffix(fileName, proofDocumentName);
};

export const getTypeSuffix = (type: FormValues["conversionType"]): string => {
  switch (type) {
    case "vacation":
    case "finalVacation":
      return "(휴가)";
    case "officialLeave":
      return "(공가)";
    case "attendance":
      return "(출결 정정)";
    default:
      return "";
  }
};

export const formatDate = (date: FormValues["date"]): string => {
  return date.format("YYMMDD");
};