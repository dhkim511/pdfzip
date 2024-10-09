export const handleDownload = (fileName: string) => {
  const link = document.createElement("a");
  link.href = `/documents/${fileName}`;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};