import type { UploadFile, UploadChangeParam } from "antd/es/upload/interface";
import type { Dayjs } from "dayjs";

export type ApplicationType = "vacation" | "officialLeave" | "attendance";

export interface FormValues {
  reason: string | Blob;
  checkOutTime: string | Blob;
  checkInTime: string | Blob;
  applicationType: ApplicationType;
  name: string;
  date: Dayjs;
  files: UploadFile[];
  vacationDate?: string;
  courseContent?: string;
  studyPlan?: string;
  specialNote?: string;
}

export type FileChangeInfo = UploadChangeParam<UploadFile>;
