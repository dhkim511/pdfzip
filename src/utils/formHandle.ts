import { FormValues } from "../types/conversionType";

export const handleFormSubmit = (values: FormValues, isSpecialType: boolean) => {
  const updatedValues = { ...values };
  
  if (isSpecialType) {
    updatedValues.checkInTime = ""; 
    updatedValues.checkOutTime = ""; 
    updatedValues.reason = values.conversionType === "vacation" ? "휴가" : "공가";
  }
  
  // proofDocumentName이 없는 경우 기본값 설정
  if (!updatedValues.proofDocumentName) {
    updatedValues.proofDocumentName = "증빙서류";
  }
  
  return updatedValues;
};