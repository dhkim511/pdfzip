import type { UploadFile, UploadChangeParam } from "antd/es/upload/interface";
import type { Dayjs } from "dayjs";

export type ConversionType = "vacation" | "officialLeave" | "attendance";

export interface FormValues {
  reason: string | Blob;
  checkOutTime: string | Blob;
  checkInTime: string | Blob;
  conversionType: ConversionType;
  name: string;
  date: Dayjs;
  files: UploadFile[];
  vacationDate?: string;
  courseContent?: string;
  studyPlan?: string;
  significant?: string;
  proofDocumentName?: string;
}

export type FileChangeInfo = UploadChangeParam<UploadFile>;