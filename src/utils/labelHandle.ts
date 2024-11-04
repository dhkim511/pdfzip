import { ConversionType } from "../types/conversionType";

export const getDateLabel = (conversionType: ConversionType): string => {
  switch (conversionType) {
    case "vacation":
      return "휴가 예정 날짜";
    case "officialLeave":
      return "공가 날짜";
    case "attendance":
      return "정정 희망 날짜";
    case "finalVacation":
      return "휴가 예정 날짜";
    default:
      return "날짜";
  }
};

export const getFileLabel = (type: ConversionType): string => {
  switch (type) {
    case "attendance":
      return "파일 첨부 ( HRD 오류 → 출석 스크린샷, 오류 화면 캡처본, 서명 이미지 ) ||| ( 기타 → 증빙서류, 서명 이미지 )";
    case "vacation":
      return "파일 첨부 (서명 이미지)";
    case "officialLeave":
      return "파일 첨부 (증빙서류, 서명 이미지)";
    case "finalVacation":
      return "파일 첨부 (서명 이미지)";
    default:
      return "파일 첨부";
  }
};