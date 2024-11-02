import { FormValues } from "../types/conversionType";
import { uploadSignFile } from "../api/fileConversion";

interface ProcessedFile {
  content: File;
  documentName: string;
}

export const getFileType = (fileName: string) => {
  const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";
  return {
    isImage: ["jpg", "jpeg", "png"].includes(fileExtension),
  };
};

const createProcessedFile = (
  file: File,
  documentName: string
): ProcessedFile => {
  return { content: file, documentName };
};

export const processFile = async (
  file: File,
  values: FormValues
): Promise<ProcessedFile | null> => {
  if (file.name.toLowerCase().includes("sign")) {
    await uploadSignFile(file);
    return null;
  }

  return createProcessedFile(
    file,
    values.proofDocumentName || "증빙서류"
  );
};