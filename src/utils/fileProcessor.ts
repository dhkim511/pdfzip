import { FormValues } from "../types/conversionType";
import { uploadSignFile } from "../api/fileConversion";

interface ProcessedFile {
  content: File;
  documentName: string;
}

type FileExtension = "jpg" | "jpeg" | "png";
const IMAGE_EXTENSIONS: FileExtension[] = ["jpg", "jpeg", "png"];

export const getFileType = (fileName: string): { isImage: boolean } => ({
  isImage: IMAGE_EXTENSIONS.includes(fileName.split(".").pop()?.toLowerCase() as FileExtension || ""),
});

export const processFile = async (
  file: File,
  values: FormValues
): Promise<ProcessedFile | null> => {
  if (file.name.toLowerCase().includes("sign")) {
    await uploadSignFile(file);
    return null;
  }

  return {
    content: file,
    documentName: values.proofDocumentName || "증빙서류",
  };
};