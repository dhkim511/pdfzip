import { FormValues } from "../types/conversionType";
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

export const processFile = async (
  file: File,
  values: FormValues,
): Promise<ProcessedFile> => {
  const { isImage, isPDF, isWord } = getFileType(file.name);

  if (isAttendanceScreenshot(file.name)) {
    return {
      content: await file.arrayBuffer(),
      needsConversion: false,
      documentName: "",
    };
  }

  if (file.name.includes("출석대장")) {
    return {
      content: file,
      needsConversion: true,
      documentName: "출석대장",
    };
  }

  const isProofDocument =
    !file.name.includes("출석대장") && !isAttendanceScreenshot(file.name);
  
  if (isProofDocument && values.proofDocumentName) {
    if (isImage || isPDF) {
      return {
        content: await file.arrayBuffer(),
        needsConversion: false,
        documentName: values.proofDocumentName,
      };
    }
    if (isWord) {
      return {
        content: file,
        needsConversion: true,
        documentName: values.proofDocumentName,
      };
    }
  }

  return {
    content: file,
    needsConversion: true,
    documentName: values.proofDocumentName || "증빙서류",
  };
};