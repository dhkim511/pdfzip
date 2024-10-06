import type { UploadFile, UploadChangeParam } from "antd/es/upload/interface";
import type { Dayjs } from "dayjs";

export type ApplicationType = "vacation" | "officialLeave" | "attendance";

export interface FormValues {
  applicationType: ApplicationType;
  name: string;
  date: Dayjs;
  files: UploadFile[];
}

export type FileChangeInfo = UploadChangeParam<UploadFile>;
