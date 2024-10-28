import { FormValues } from "../types/conversionType";
import { uploadSignFile } from "../api/fileConversion";
import { isAttendanceScreenshot } from "./fileNameHandle";

interface ProcessedFile {
  content: ArrayBuffer | File;
  needsConversion: boolean;
  documentName: string;
  isAttendanceLog?: boolean;  
}

const getFileType = (fileName: string) => {
  const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";
  return {
    isImage: ["jpg", "jpeg", "png"].includes(fileExtension),
    isPDF: fileExtension === "pdf",
    isWord: ["doc", "docx"].includes(fileExtension),
  };
};

const createProcessedFile = async (
  file: File,
  needsConversion: boolean,
  documentName: string,
  isArrayBuffer: boolean = false,
  isAttendanceLog: boolean = false
): Promise<ProcessedFile> => {
  const content = isArrayBuffer ? await file.arrayBuffer() : file;
  return { content, needsConversion, documentName, isAttendanceLog };
};

export const processFile = async (
  file: File,
  values: FormValues
): Promise<ProcessedFile | null> => {
  const { isImage, isPDF, isWord } = getFileType(file.name);
  const isAttendance = isAttendanceScreenshot(file.name);
  const isAttendanceDocument = file.name.toLowerCase().includes("출석대장");

  if (file.name.toLowerCase().includes("sign")) {
    await uploadSignFile(file);
    return null;
  }

  if (isAttendance) {
    return createProcessedFile(file, false, "", true);
  }

  if (isAttendanceDocument) {
    return createProcessedFile(file, true, "출석대장", false, true);
  }

  const isProofDocument = !isAttendanceDocument && !isAttendance;
  if (isProofDocument) {
    if (values.conversionType === "vacation") {
      if (file.name.includes("휴가") || file.name.includes("계획서")) {
        return createProcessedFile(file, true, "휴가계획서");
      }
    }

    if (values.proofDocumentName) {
      if (isWord) {
        return createProcessedFile(file, true, values.proofDocumentName);
      }
      if (isImage || isPDF) {
        return createProcessedFile(file, false, values.proofDocumentName, true);
      }
    }
    return createProcessedFile(file, true, "증빙서류");
  }

  return createProcessedFile(file, false, "", true);
};
