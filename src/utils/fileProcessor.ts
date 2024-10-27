import { FormValues } from "../types/conversionType";
import { uploadSignFile } from "../api/fileConversion";
import { isAttendanceScreenshot } from "./fileNameHandle";

interface ProcessedFile {
  content: ArrayBuffer | File;
  needsConversion: boolean;
  documentName: string;
}

const getFileType = (fileName: string) => {
  const fileExtension = fileName.toLowerCase().split(".").pop() || "";
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
  isArrayBuffer: boolean = false
): Promise<ProcessedFile> => {
  const content = isArrayBuffer ? await file.arrayBuffer() : file;
  return { content, needsConversion, documentName };
};

export const processFile = async (
  file: File,
  values: FormValues
): Promise<ProcessedFile | null> => {
  const { isImage, isPDF, isWord } = getFileType(file.name);
  const isAttendance = isAttendanceScreenshot(file.name);
  const isAttendanceDocument = file.name.includes("출석대장");

  if (file.name.toLowerCase().includes("sign")) {
    await uploadSignFile(file);
    return null; 
  }

  if (isAttendance) {
    return createProcessedFile(file, false, "", true);
  }

  if (isAttendanceDocument) {
    return createProcessedFile(file, true, "출석대장");
  }

  const isProofDocument = !isAttendanceDocument && !isAttendance;

  if (isProofDocument && values.proofDocumentName) {
    if (isImage || isPDF) {
      return createProcessedFile(file, false, values.proofDocumentName, true);
    }
    if (isWord) {
      return createProcessedFile(file, true, values.proofDocumentName);
    }
  }

  return createProcessedFile(file, true, values.proofDocumentName || "증빙서류");
};
