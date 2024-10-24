import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FormValues } from "../types/conversionType";
import { getSuffix, isAttendanceScreenshot, getTypeSuffix, formatDate } from "./fileNameHandle";
import { SERVER_URL } from "../constants/environmentConfig";

interface ProcessedFile {
  content: ArrayBuffer | File;
  needsConversion: boolean;
  documentName: string;
}

const processFile = async (file: File, values: FormValues): Promise<ProcessedFile> => {
  const fileExtension = file.name.toLowerCase().split('.').pop();
  const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension || '');
  const isPDF = fileExtension === 'pdf';
  const isWord = ['doc', 'docx'].includes(fileExtension || '');
  
  // 출석대장 체크
  if (file.name.includes('출석대장')) {
    return {
      content: file,
      needsConversion: true,
      documentName: '출석대장'
    };
  }

  // 스크린샷은 변환 없이 처리
  if (isAttendanceScreenshot(file.name)) {
    return {
      content: await file.arrayBuffer(),
      needsConversion: false,
      documentName: '스크린샷'
    };
  }
  
  // 증빙서류 처리
  const isProofDocument = !file.name.includes('출석대장') && !isAttendanceScreenshot(file.name);
  if (isProofDocument && values.proofDocumentName) {
    if (isImage || isPDF) {
      return {
        content: await file.arrayBuffer(),
        needsConversion: false,
        documentName: values.proofDocumentName
      };
    }
    if (isWord) {
      return {
        content: file,
        needsConversion: true,
        documentName: values.proofDocumentName
      };
    }
  }
  
  // 기본적으로 변환 필요
  return {
    content: file,
    needsConversion: true,
    documentName: values.proofDocumentName || '증빙서류'
  };
};

export const createAndDownloadZip = async (values: FormValues, fileList: File[]) => {
  const zip = new JSZip();

  if (values.conversionType === 'vacation') {
    const response = await fetch(`${SERVER_URL}/convert`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversionType: values.conversionType,
        date: values.date.format(),  
        name: values.name,
        courseContent: values.courseContent || '',
        studyPlan: values.studyPlan || '',
        significant: values.significant || '',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    for (const file of result.files) {
      const fileResponse = await fetch(`${SERVER_URL}${file.path}`);
      if (!fileResponse.ok) {
        throw new Error(`File fetch error: ${fileResponse.status}`);
      }
      const blob = await fileResponse.blob();
      const baseFileName = `${formatDate(values.date)}_데브캠프_프론트엔드 개발 4회차_${values.name}`;
      const suffix = file.name.includes("vacation") 
        ? getSuffix("휴가 사용 계획서", values.conversionType)
        : getSuffix("출석대장", values.conversionType);
      const fileName = `${baseFileName}${suffix}.pdf`;
      zip.file(fileName, blob);
    }
  } else {
    // 출결정정 및 공가 처리
    for (const file of fileList) {
      const processedFile = await processFile(file, values);
      
      if (processedFile.needsConversion) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("conversionType", values.conversionType);
        formData.append("date", values.date.format());  
        formData.append("name", values.name);
        formData.append("checkInTime", values.checkInTime);
        formData.append("checkOutTime", values.checkOutTime);
        formData.append("reason", values.reason);
        formData.append("proofDocumentName", processedFile.documentName);

        const response = await fetch(`${SERVER_URL}/convert`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const fileResponse = await fetch(`${SERVER_URL}${result.files[0].path}`);
        if (!fileResponse.ok) {
          throw new Error(`File fetch error: ${fileResponse.status}`);
        }

        const blob = await fileResponse.blob();
        const baseFileName = `${formatDate(values.date)}_데브캠프_프론트엔드 개발 4회차_${values.name}`;
        const fileName = `${baseFileName}(${processedFile.documentName}).pdf`;
        zip.file(fileName, blob);
      } else {
        const baseFileName = `${formatDate(values.date)}_데브캠프_프론트엔드 개발 4회차_${values.name}`;
        const fileExtension = file.name.slice(file.name.lastIndexOf('.'));
        const fileName = `${baseFileName}(${processedFile.documentName})${fileExtension}`;
        zip.file(fileName, processedFile.content);
      }
    }
  }

  const content = await zip.generateAsync({ type: "blob" });
  const typeSuffix = getTypeSuffix(values.conversionType);
  const zipDate = formatDate(values.date);
  saveAs(
    content,
    `${zipDate}_데브캠프_프론트엔드 개발 4회차_${values.name}${typeSuffix}.zip`
  );
};