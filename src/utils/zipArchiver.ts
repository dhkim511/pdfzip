import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FormValues } from "../types/applicationType";
import { getSuffix, isAttendanceScreenshot, getTypeSuffix, formatDate } from "./fileNameHandle";
import { SERVER_URL } from "../constants/environmentConfig";

export const createAndDownloadZip = async (
 values: FormValues,
 fileList: File[]
) => {
 const zip = new JSZip();

 // 휴가 신청일 경우 문서 생성
 if (values.applicationType === 'vacation') {
   const response = await fetch(`${SERVER_URL}/convert`, {
     method: "POST",
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       applicationType: values.applicationType,
       date: formatDate(values.date),
       name: values.name,
       courseContent: values.courseContent || '',
       studyPlan: values.studyPlan || '',
       specialNote: values.specialNote || '',
       reason: values.reason
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
       ? getSuffix("휴가 사용 계획서", values.applicationType)
       : getSuffix("출석대장", values.applicationType);
     const fileName = `${baseFileName}${suffix}.pdf`;
     zip.file(fileName, blob);
   }
 } else {
   // 출결 정정의 경우
   for (const file of fileList) {
     const formData = new FormData();
     formData.append("file", file);
     formData.append("applicationType", values.applicationType);
     formData.append("date", formatDate(values.date));
     formData.append("name", values.name);
     formData.append("checkInTime", values.checkInTime);
     formData.append("checkOutTime", values.checkOutTime);
     formData.append("reason", values.reason);

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
     const fileName = `${baseFileName}${getSuffix("출석대장", values.applicationType)}.pdf`;
     zip.file(fileName, blob);
   }
 }

 // 첨부 파일 처리 (스크린샷만)
 const screenshotTasks = fileList.filter(file => 
   isAttendanceScreenshot(file.name)
 ).map(async (file) => {
   const fileContent = await file.arrayBuffer();
   const baseFileName = `${formatDate(values.date)}_데브캠프_프론트엔드 개발 4회차_${values.name}`;
   const fileName = `${baseFileName}${getSuffix(file.name, values.applicationType)}${file.name.slice(file.name.lastIndexOf('.'))}`;
   zip.file(fileName, fileContent);
 });

 await Promise.all(screenshotTasks);

 const content = await zip.generateAsync({ type: "blob" });
 const typeSuffix = getTypeSuffix(values.applicationType);
 const formattedDate = formatDate(values.date);
 saveAs(
   content,
   `${formattedDate}_데브캠프_프론트엔드 개발 4회차_${values.name}${typeSuffix}.zip`
 );
};
