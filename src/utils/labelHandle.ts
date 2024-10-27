import { ConversionType } from "../types/conversionType";

export const getDateLabel = (conversionType: ConversionType): string => {
  switch (conversionType) {
    case "vacation":
      return "휴가 예정 날짜";
    case "officialLeave":
      return "공가 날짜";
    case "attendance":
      return "정정 희망 날짜";
    default:
      return "날짜";
  }
};

export const getFileLabel = (type: ConversionType): string => {
  switch (type) {
    case "attendance":
      return "파일 첨부 (출석대장, 출석 스크린샷 or 증빙서류, 서명 이미지)";
    case "vacation":
      return "파일 첨부 (출석대장, 휴가계획서, 서명 이미지)";
    case "officialLeave":
      return "파일 첨부 (출석대장, 증빙서류, 서명 이미지)";
    default:
      return "파일 첨부";
  }
};
