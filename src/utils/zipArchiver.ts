import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FormValues } from "../types/applicationType";
import { getSuffix, isAttendanceScreenshot, getTypeSuffix, formatDate } from "./fileNameHandle";
import { SERVER_URL } from "../constants/environmentConfig";

export const createAndDownloadZip = async (
  values: FormValues,
  fileList: File[]
) => {
  const zip = new JSZip();

  const fileProcessingTasks = fileList.map(async (file) => {
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
    const suffix = getSuffix(file.name, values.applicationType);
    const isImage = ["jpg", "jpeg", "png"].includes(fileExtension);
    const isScreenshot = isAttendanceScreenshot(file.name);

    let fileName = file.name;

    if (!isScreenshot) {
      fileName = `${formatDate(values.date)}_데브캠프_프론트엔드 개발 4회차_${values.name}${suffix}`;
      if (isImage) {
        fileName += `.${fileExtension}`;
      } else {
        fileName += ".pdf";
      }
    }

    if (isImage) {
      const fileContent = await file.arrayBuffer();
      zip.file(fileName, fileContent);
    } else {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", values.applicationType);
      formData.append("fileName", fileName);
      formData.append("date", formatDate(values.date));
      formData.append("name", values.name);
      formData.append("checkInTime", values.checkInTime);
      formData.append("checkOutTime", values.checkOutTime);
      formData.append("reason", values.reason);

      const response = await fetch(`${SERVER_URL}/convert`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const fileResponse = await fetch(`${SERVER_URL}${result.path}`);
      if (!fileResponse.ok) {
        throw new Error(`File fetch error: ${fileResponse.status}`);
      }

      const blob = await fileResponse.blob();
      zip.file(fileName, blob);
    }
  });

  await Promise.all(fileProcessingTasks);

  const content = await zip.generateAsync({ type: "blob" });
  const typeSuffix = getTypeSuffix(values.applicationType);
  const formattedDate = formatDate(values.date);
  saveAs(
    content,
    `${formattedDate}_데브캠프_프론트엔드 개발 4회차_${values.name}${typeSuffix}.zip`
  );
};
