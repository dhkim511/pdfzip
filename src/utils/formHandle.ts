import { FormValues } from "../types/conversionType";

export const handleFormSubmit = (values: FormValues, isSpecialType: boolean) => {
  if (isSpecialType) {
    values.checkInTime = ""; 
    values.checkOutTime = ""; 
    values.reason = values.conversionType === "vacation" ? "휴가" : "공가";
  }
  return values;
};
