import { FormValues } from "../types/conversionType";
import { uploadSignFile } from "../api/fileConversion";

interface ProcessedFile {
  content: File;
  needsConversion: boolean;
  documentName: string;
}

export const getFileType = (fileName: string) => {
  const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";
  return {
    isImage: ["jpg", "jpeg", "png"].includes(fileExtension),
    isPDF: fileExtension === "pdf",
    isWord: ["doc", "docx"].includes(fileExtension),
  };
};

const createProcessedFile = (
  file: File,
  needsConversion: boolean,
  documentName: string
): ProcessedFile => {
  return { content: file, needsConversion, documentName };
};

export const processFile = async (
  file: File,
  values: FormValues
): Promise<ProcessedFile | null> => {
  if (file.name.toLowerCase().includes("sign")) {
    await uploadSignFile(file);
    return null;
  }

  const { isWord } = getFileType(file.name);
  const isAttendanceDocument = file.name.toLowerCase().includes("출석대장");

  if (isAttendanceDocument) {
    return createProcessedFile(file, true, "출석대장");
  }

  if ((values.conversionType === "vacation" || values.conversionType === "finalVacation") && isWord) {
    if (file.name.includes("휴가") || file.name.includes("계획서")) {
      return createProcessedFile(file, true, "휴가계획서");
    }
  }

  if (isWord) {
    return createProcessedFile(
      file, 
      true, 
      values.proofDocumentName || "증빙서류"
    );
  }

  return null;
};