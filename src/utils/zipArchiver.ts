import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FormValues } from "../types/conversionType";
import { formatDate, getSuffix, getTypeSuffix, isAttendanceScreenshot } from "./fileNameHandle";
import { processFile } from "./fileProcessor";
import {
  convertVacationFiles,
  convertFile,
  fetchConvertedFile,
} from "../api/fileConversion";

interface ConvertedFile {
  content: Blob | ArrayBuffer | string;
  path: string;
  name: string;
}

const createBaseFileName = (values: FormValues) =>
  `${formatDate(values.date)}_데브캠프_프론트엔드 개발 4회차_${values.name}`;

const addFileToZip = async (
  zip: JSZip,
  baseFileName: string,
  file: ConvertedFile,
  suffix: string,
  isBlob: boolean = true
) => {
  const blob = isBlob ? await fetchConvertedFile(file.path) : file.content;
  const fileName = `${baseFileName}${suffix}.pdf`;
  zip.file(fileName, blob);
};

const processVacationFiles = async (zip: JSZip, values: FormValues) => {
  const result = await convertVacationFiles(values);
  const baseFileName = createBaseFileName(values);

  await Promise.all(
    result.files.map(async (file: ConvertedFile) => {
      const suffix = file.name.includes("vacation")
        ? getSuffix("휴가 사용 계획서", values.conversionType)
        : getSuffix("출석대장", values.conversionType, undefined, true);
      await addFileToZip(zip, baseFileName, file, suffix);
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
      if (!processedFile) {
        return;
      }

      const baseFileName = createBaseFileName(values);

      if (isAttendanceScreenshot(file.name)) {
        zip.file(file.name, processedFile.content);
        return;
      }

      if (processedFile.needsConversion) {
        const result = await convertFile(file, values);
        const suffix = getSuffix(
          file.name, 
          values.conversionType, 
          processedFile.documentName, 
          processedFile.isAttendanceLog
        );
        await addFileToZip(zip, baseFileName, result.files[0], suffix);
      } else {
        const fileExtension = file.name.slice(file.name.lastIndexOf("."));
        const documentSuffix = getSuffix(
          file.name, 
          values.conversionType, 
          processedFile.documentName, 
          processedFile.isAttendanceLog
        );
        const fileName = `${baseFileName}${documentSuffix}${fileExtension}`;
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