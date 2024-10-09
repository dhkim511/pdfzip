import { RESOURCES } from "../constants/resources";

type Resources = {
  DOCS: { [key: string]: string };
};

export const handleDownload = (resourceKey: string) => {
  const fileName = (RESOURCES as Resources)['DOCS'][resourceKey];

  const link = document.createElement("a");
  link.href = `/documents/${fileName}`;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};