import { ConversionType } from "../types/conversionType";

export const getDateLabel = (conversionType: ConversionType): string => {
  switch (conversionType) {
    case "vacation":
    case "finalVacation":
      return "휴가 예정 날짜";
    case "officialLeave":
      return "공가 날짜";
    case "attendance":
      return "정정 희망 날짜";
    default:
      return "날짜";
  }
};

interface FileRequirement {
  category?: string;
  files: string[];
}

interface FileLabel {
  primary: FileRequirement | FileRequirement[];
  warning?: FileRequirement;
}

export const getFileLabel = (type: ConversionType): FileLabel => {
  const defaultFiles = { files: ["서명 이미지"] };
  
  switch (type) {
    case "attendance":
      return {
        primary: {
          category: "HRD 오류",
          files: ["출석 스크린샷", "오류 캡처본", "서명 이미지"],
        },
        warning: {
          category: "기타",
          files: ["증빙서류", "서명 이미지"],
        },
      };
    case "officialLeave":
      return {
        primary: {
          files: ["증빙서류", "서명 이미지"],
        },
      };
    case "vacation":
    case "finalVacation":
      return {
        primary: defaultFiles,
      };
    default:
      return {
        primary: {
          files: [],
        },
      };
  }
};