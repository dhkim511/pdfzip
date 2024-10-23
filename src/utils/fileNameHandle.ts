import { FormValues } from "../types/conversionType";

export const isAttendanceScreenshot = (fileName: string): boolean => {
  return (
    (fileName.includes("오전") || fileName.includes("오후")) &&
    (fileName.includes("10") ||
      fileName.includes("2") ||
      fileName.includes("7"))
  );
};

export const getSuffix = (
  fileName: string,
  type: FormValues["conversionType"]
): string => {
  if (type === "officialLeave") {
    if (fileName.includes("출석대장")) return "(출석대장)";
    if (isAttendanceScreenshot(fileName)) return "(증빙서류)";
    return "(증빙서류)";
  }
  if (type === "vacation") {
    if (fileName.includes("출석대장")) return "(출석대장)";
    if (fileName.includes("휴가 사용 계획서")) return "(휴가계획서)";
  }
  if (type === "attendance") {
    if (fileName.includes("출석대장")) return "(출석대장)";
    if (isAttendanceScreenshot(fileName)) return "";
    return "(증빙서류)";
  }
  return "";
};

export const getTypeSuffix = (type: FormValues["conversionType"]): string => {
  switch (type) {
    case "vacation":
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
