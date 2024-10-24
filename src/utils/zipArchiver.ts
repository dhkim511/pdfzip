import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FormValues } from "../types/conversionType";
import { formatDate, getSuffix, getTypeSuffix } from "./fileNameHandle";
import { processFile } from "./fileProcessor";
import {
  convertVacationFiles,
  convertFile,
  fetchConvertedFile,
} from "../api/fileConversion";
import { isAttendanceScreenshot } from "./fileNameHandle";

const createBaseFileName = (values: FormValues) =>
  `${formatDate(values.date)}_데브캠프_프론트엔드 개발 4회차_${values.name}`;

const processVacationFiles = async (zip: JSZip, values: FormValues) => {
  const result = await convertVacationFiles(values);
  const baseFileName = createBaseFileName(values);

  await Promise.all(
    result.files.map(async (file: any) => {
      const blob = await fetchConvertedFile(file.path);
      const suffix = file.name.includes("vacation")
        ? getSuffix("휴가 사용 계획서", values.conversionType)
        : getSuffix("출석대장", values.conversionType);
      const fileName = `${baseFileName}${suffix}.pdf`;
      zip.file(fileName, blob);
    })
  );
};

const processRegularFiles = async (
  zip: JSZip,
  values: FormValues,
  fileList: File[]
) => {
  await Promise.all(
    fileList.map(async (file: File) => {
      const processedFile = await processFile(file, values);
      const baseFileName = createBaseFileName(values);

      if (isAttendanceScreenshot(file.name)) {
        zip.file(file.name, processedFile.content);
        return;
      }

      if (processedFile.needsConversion) {
        const result = await convertFile(file, values);
        const blob = await fetchConvertedFile(result.files[0].path);
        const fileName = `${baseFileName}(${processedFile.documentName}).pdf`;
        zip.file(fileName, blob);
      } else {
        const fileExtension = file.name.slice(file.name.lastIndexOf("."));
        const fileName = `${baseFileName}(${processedFile.documentName})${fileExtension}`;
        zip.file(fileName, processedFile.content);
      }
    })
  );
};

export const createAndDownloadZip = async (
  values: FormValues,
  fileList: File[]
) => {
  const zip = new JSZip();

  if (values.conversionType === "vacation") {
    await processVacationFiles(zip, values);
  } else {
    await processRegularFiles(zip, values, fileList);
  }

  const content = await zip.generateAsync({ type: "blob" });
  const typeSuffix = getTypeSuffix(values.conversionType);
  const zipFileName = `${createBaseFileName(values)}${typeSuffix}.zip`;
  
  saveAs(content, zipFileName);
};