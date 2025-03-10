import type { UploadFile, UploadChangeParam } from "antd/es/upload/interface";
import type { Dayjs } from "dayjs";

export type ConversionType = "vacation" | "officialLeave" | "attendance";

export type CourseName = string;

export interface FormValues {
  // 과정명, 이름, 날짜
  courseType: CourseName;
  name: string;
  date: Dayjs;
  
  // 신청유형, 파일
  conversionType: ConversionType;
  files: UploadFile[];
  
  // 입실 시간, 퇴실 시간, 사유
  checkInTime: string;
  checkOutTime: string;
  reason: string;

  // 불참하는 과정 교육내용, 학습 진행 계획, 휴가 일자
  courseContent?: string;
  studyPlan?: string;
  vacationDate?: string;
  
  // 휴이사항, 증빙서류명
  significant?: string;
  proofDocumentName?: string;
}

export type FileChangeInfo = UploadChangeParam<UploadFile>;