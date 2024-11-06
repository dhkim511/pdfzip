import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FormValues } from "../types/conversionType";
import {
  formatDate,
  getSuffix,
  getTypeSuffix,
  isAttendanceScreenshot,
} from "./fileNameHandle";
import { processFile, getFileType } from "./fileProcessor";
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
) => {
  const blob = await fetchConvertedFile(file.path);
  const fileName = `${baseFileName}${suffix}.pdf`;
  zip.file(fileName, blob);
};

const processVacationFiles = async (zip: JSZip, values: FormValues) => {
  const result = await convertVacationFiles(values);
  const baseFileName = createBaseFileName(values);

  await Promise.all(
    result.files.map(async (file: ConvertedFile) => {
      const suffix = file.name.includes("vacation")
        ? "(휴가계획서)"
        : "(출석대장)";
      await addFileToZip(zip, baseFileName, file, suffix);
    }),
  );
};

const processRegularFiles = async (
  zip: JSZip,
  values: FormValues,
  fileList: File[],
) => {
  await Promise.all(
    fileList.map(async (file: File) => {
      const { isImage } = getFileType(file.name);
      const baseFileName = createBaseFileName(values);

      if (isAttendanceScreenshot(file.name)) {
        const content = await file.arrayBuffer();
        zip.file(file.name, content);
        return;
      }

      if (isImage) {
        const content = await file.arrayBuffer();
        const fileExtension = file.name.slice(file.name.lastIndexOf("."));
        const documentSuffix = getSuffix(file.name, values.proofDocumentName);
        const fileName = `${baseFileName}${documentSuffix}${fileExtension}`;
        zip.file(fileName, content);
        return;
      }

      const processedFile = await processFile(file, values);
      if (!processedFile) {
        return;
      }

      const result = await convertFile(file, values);
      const suffix = getSuffix(file.name, processedFile.documentName);
      await addFileToZip(zip, baseFileName, result.files[0], suffix);
    }),
  );

  if (
    values.conversionType === "attendance" ||
    values.conversionType === "officialLeave"
  ) {
    const attendanceFile = await convertFile(
      new File([], "attendance.docx"),
      values,
    );
    const baseFileName = createBaseFileName(values);
    await Promise.all(
      attendanceFile.files.map(async (file: ConvertedFile) => {
        const suffix = getSuffix("출석대장", values.conversionType);
        await addFileToZip(zip, baseFileName, file, suffix);
      }),
    );
  }
};

export const createAndDownloadZip = async (
  values: FormValues,
  fileList: File[],
) => {
  const zip = new JSZip();

  if (
    values.conversionType === "vacation" ||
    values.conversionType === "finalVacation"
  ) {
    await processVacationFiles(zip, values);
  } else {
    await processRegularFiles(zip, values, fileList);
  }

  const content = await zip.generateAsync({ type: "blob" });
  const typeSuffix = getTypeSuffix(values.conversionType);
  const zipFileName = `${createBaseFileName(values)}${typeSuffix}.zip`;

  saveAs(content, zipFileName);
};
