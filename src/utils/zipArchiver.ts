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

const createBaseFileName = (values: FormValues): string => {
  return `${formatDate(values.date)}_${removeParentheses(values.courseType)}_${values.name}`;
};

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
  values: FormValues,
  index: number,
  totalFiles: number
): Promise<void> => {
  const processedFile = await processFile(file, values);
  if (!processedFile) return;

  const content = await file.arrayBuffer();
  if (isAttendanceScreenshot(file.name)) {
    zip.file(file.name, content);
    return;
  }

  const fileExtension = file.name.slice(file.name.lastIndexOf("."));
  const fileName = totalFiles > 1
    ? `${baseFileName}(${values.proofDocumentName}_${index + 1})${fileExtension}`
    : `${baseFileName}(${values.proofDocumentName})${fileExtension}`;
  zip.file(fileName, content);
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

  if (
    values.conversionType === "attendance" ||
    values.conversionType === "officialLeave"
  ) {
    const attendanceFile = await convertFile(
      new File([], "attendance.docx"),
      values
    );
    
    await Promise.all(
      attendanceFile.files.map(async (file: ConvertedFile) => {
        const suffix = getSuffix("출석대장", values.conversionType);
        await addFileToZip(zip, baseFileName, file, suffix);
      })
    );
  }

  const imageFiles = fileList.filter(file => getFileType(file.name).isImage);
  await Promise.all(
    imageFiles.map(async (file, index) => {
      await handleImageFile(zip, file, baseFileName, values, index, imageFiles.length);
    })
  );
};

export const createAndDownloadZip = async (
  values: FormValues,
  fileList: File[]
): Promise<void> => {
  const zip = new JSZip();
  const isVacationType = ["vacation", "finalVacation"].includes(
    values.conversionType
  );

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