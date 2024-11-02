import { RefObject } from "react";
import SignatureCanvas from "react-signature-canvas";

export const handleSignatureClear = (
  signatureRef: RefObject<SignatureCanvas>,
) => {
  if (signatureRef.current) {
    signatureRef.current.clear();
  }
};

export const handleSignatureDownload = (
  signatureRef: RefObject<SignatureCanvas>,
) => {
  if (signatureRef.current) {
    const dataURL = signatureRef.current.toDataURL();
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "sign.png";
    link.click();
  }
};


