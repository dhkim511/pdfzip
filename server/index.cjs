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

const uploadDir = "uploads";
const convertedDir = "converted";

const app = express();
const upload = multer({ dest: path.join(__dirname, uploadDir) });

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(`/${convertedDir}`, express.static(path.join(__dirname, convertedDir)));

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
};

ensureDir(path.join(__dirname, uploadDir));
ensureDir(path.join(__dirname, convertedDir));

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
          if (fs.existsSync(outputPath)) {
            await fs.promises.unlink(outputPath);
          }
        } catch (error) {
          console.error("Error deleting converted file", error);
        }
      }, 60000);
    });

    outputStream.on("error", (err) => {
      res.status(500).send("Error saving file");
    });
  } catch (error) {
    res.status(500).send({ message: "Error occurred during conversion." });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
