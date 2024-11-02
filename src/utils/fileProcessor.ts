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

  if (isWord) {
    return createProcessedFile(
      file, 
      true, 
      values.proofDocumentName || "증빙서류"
    );
  }

  return null;
};