const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const dotenv = require("dotenv");
const {
  PDFServices,
  ServicePrincipalCredentials,
  MimeType,
  CreatePDFJob,
  CreatePDFResult,
} = require("@adobe/pdfservices-node-sdk");

dotenv.config();

const uploadDir = process.env.UPLOAD_DIR || "uploads";
const convertedDir = process.env.CONVERTED_DIR || "converted";

const app = express();
const upload = multer({ dest: path.join(__dirname, uploadDir) });

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(`/${convertedDir}`, express.static(path.join(__dirname, convertedDir)));
app.use(express.static(path.join(__dirname, "..", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

const ensureDir = async (dirPath) => {
  try {
    await fs.promises.access(dirPath);
  } catch {
    await fs.promises.mkdir(dirPath);
  }
};

(async () => {
  await ensureDir(path.join(__dirname, uploadDir));
  await ensureDir(path.join(__dirname, convertedDir));
})();

app.post("/convert", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const inputPath = req.file.path;
  const outputFileName = req.body.fileName.endsWith(".pdf")
    ? req.body.fileName
    : `${req.body.fileName || "converted"}.pdf`;
  const outputPath = path.join(__dirname, convertedDir, outputFileName);

  try {
    const credentials = new ServicePrincipalCredentials({
      clientId: process.env.PDF_SERVICES_CLIENT_ID,
      clientSecret: process.env.PDF_SERVICES_CLIENT_SECRET,
      organizationId: process.env.PDF_SERVICES_ORG_ID,
    });

    const pdfServices = new PDFServices({ credentials });

    const inputAsset = await pdfServices.upload({
      readStream: fs.createReadStream(inputPath),
      mimeType: MimeType.DOCX,
    });

    const job = new CreatePDFJob({ inputAsset });
    const pollingURL = await pdfServices.submit({ job });
    const pdfServicesResponse = await pdfServices.getJobResult({
      pollingURL,
      resultType: CreatePDFResult,
    });

    const resultAsset = pdfServicesResponse.result.asset;
    const streamAsset = await pdfServices.getContent({ asset: resultAsset });
    const outputStream = fs.createWriteStream(outputPath);
    streamAsset.readStream.pipe(outputStream);

    outputStream.on("finish", async () => {
      await fs.promises.unlink(inputPath);

      res.json({
        message: "File converted successfully",
        path: `/${convertedDir}/${outputFileName}`,
        name: outputFileName,
      });

      setTimeout(async () => {
        try {
          await fs.promises.access(outputPath);
          await fs.promises.unlink(outputPath);
        } catch (error) {
          console.error("Error during file deletion:", error);
        }
      }, 60000);
    });

    outputStream.on("error", (err) => {
      res.status(500).send("Error saving file");
    });
  } catch (error) {
    res.status(500).send({ message: "PDF 변환 중 오류가 발생했습니다." });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
