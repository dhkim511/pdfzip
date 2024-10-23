import { FormValues } from "../types/conversionType";

export const handleFormSubmit = (values: FormValues, isVacationType: boolean) => {
  if (isVacationType) {
    values.checkInTime = "10:00";
    values.checkOutTime = "19:00";
    values.reason = "휴가";
  }
  return values;
};