import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FormValues } from "../types/conversionType";
import {
  formatDate,
  getSuffix,
  getTypeSuffix,
  isAttendanceScreenshot,
  removeParentheses,
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

const createBaseFileName = (values: FormValues): string =>
  `${formatDate(values.date)}_${removeParentheses(values.courseType)}_${values.name}`;

const addFileToZip = async (
  zip: JSZip,
  baseFileName: string,
  file: ConvertedFile,
  suffix: string
): Promise<void> => {
  const blob = await fetchConvertedFile(file.path);
  const fileName = `${baseFileName}${suffix}.pdf`;
  zip.file(fileName, blob);
};

const handleImageFile = async (
  zip: JSZip,
  file: File,
  baseFileName: string,
  values: FormValues
): Promise<void> => {
  const content = await file.arrayBuffer();
  
  if (isAttendanceScreenshot(file.name)) {
    zip.file(file.name, content);
    return;
  }
  
  const fileExtension = file.name.slice(file.name.lastIndexOf("."));
  const documentSuffix = getSuffix(file.name, values.proofDocumentName);
  const fileName = `${baseFileName}${documentSuffix}${fileExtension}`;
  zip.file(fileName, content);
};

const handleDocumentFile = async (
  zip: JSZip,
  file: File,
  baseFileName: string,
  values: FormValues
): Promise<void> => {
  const processedFile = await processFile(file, values);
  if (!processedFile) return;

  const result = await convertFile(file, values);
  const suffix = getSuffix(file.name, processedFile.documentName);
  await addFileToZip(zip, baseFileName, result.files[0], suffix);
};

const processVacationFiles = async (
  zip: JSZip,
  values: FormValues
): Promise<void> => {
  const result = await convertVacationFiles(values);
  const baseFileName = createBaseFileName(values);

  await Promise.all(
    result.files.map(async (file: ConvertedFile) => {
      const suffix = file.name.includes("vacation")
        ? "(휴가계획서)"
        : "(출석대장)";
      await addFileToZip(zip, baseFileName, file, suffix);
    })
  );
};

const processRegularFiles = async (
  zip: JSZip,
  values: FormValues,
  fileList: File[]
): Promise<void> => {
  const baseFileName = createBaseFileName(values);

  await Promise.all(
    fileList.map(async (file: File) => {
      const { isImage } = getFileType(file.name);
      if (isImage) {
        await handleImageFile(zip, file, baseFileName, values);
      } else {
        await handleDocumentFile(zip, file, baseFileName, values);
      }
    })
  );

  if (["attendance", "officialLeave"].includes(values.conversionType)) {
    const attendanceFile = await convertFile(new File([], "attendance.docx"), values);
    await Promise.all(
      attendanceFile.files.map(async (file: ConvertedFile) => {
        const suffix = getSuffix("출석대장", values.conversionType);
        await addFileToZip(zip, baseFileName, file, suffix);
      })
    );
  }
};

export const createAndDownloadZip = async (
  values: FormValues,
  fileList: File[]
): Promise<void> => {
  const zip = new JSZip();
  const isVacationType = ["vacation", "finalVacation"].includes(values.conversionType);

  if (isVacationType) {
    await processVacationFiles(zip, values);
  } else {
    await processRegularFiles(zip, values, fileList);
  }

  const content = await zip.generateAsync({ type: "blob" });
  const typeSuffix = getTypeSuffix(values.conversionType);
  const zipFileName = `${createBaseFileName(values)}${typeSuffix}.zip`;

  saveAs(content, zipFileName);
};
