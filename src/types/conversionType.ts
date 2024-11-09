import type { UploadFile, UploadChangeParam } from "antd/es/upload/interface";
import type { Dayjs } from "dayjs";

export interface Course {
  name: string;
}

export type ConversionType =
  | "vacation"
  | "officialLeave"
  | "attendance"
  | "finalVacation";

export interface FormValues {
  courseType: string;  
  reason: string;      
  checkOutTime: string;
  checkInTime: string; 
  conversionType: ConversionType;
  name: string;
  date: Dayjs;
  files: UploadFile[];
  vacationDate?: string;
  courseContent?: string;
  studyPlan?: string;
  significant?: string;
  proofDocumentName?: string;
  currentTasks?: string;
  taskAdjustments?: string;
  workPlan?: string;
}

export type FileChangeInfo = UploadChangeParam<UploadFile>;