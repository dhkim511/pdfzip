const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const dotenv = require("dotenv");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const { PDFServices, ServicePrincipalCredentials, MimeType, CreatePDFJob, CreatePDFResult } = require("@adobe/pdfservices-node-sdk");

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

const formatDateYYMMDD = (date) => {
  const year = date.getFullYear().toString().slice(-2);
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  const day = (`0${date.getDate()}`).slice(-2);
  return `${year}${month}${day}`;
};

const fillAttendanceForm = async (values) => {
  const templatePath = path.join(__dirname, "templates", "attendance_template.docx");
  const content = fs.readFileSync(templatePath, "binary");

  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip);

  const applicationDate = formatDateYYMMDD(new Date());

  doc.setData({
    date: values.date,
    applicationDate, 
    name: values.name,
    checkInTime: values.checkInTime,
    checkOutTime: values.checkOutTime,
    reason: values.reason,
  });

  try {
    doc.render();
  } catch (error) {
    console.error("Error during template processing:", error);
    throw error;
  }

  const buffer = doc.getZip().generate({ type: "nodebuffer" });
  const outputPath = path.join(__dirname, convertedDir, "filled_attendance.docx");
  fs.writeFileSync(outputPath, buffer);

  return outputPath;
};

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
    const filledDocPath = await fillAttendanceForm(req.body);

    const credentials = new ServicePrincipalCredentials({
      clientId: process.env.PDF_SERVICES_CLIENT_ID,
      clientSecret: process.env.PDF_SERVICES_CLIENT_SECRET,
      organizationId: process.env.PDF_SERVICES_ORG_ID,
    });

    const pdfServices = new PDFServices({ credentials });

    const inputAsset = await pdfServices.upload({
      readStream: fs.createReadStream(filledDocPath),
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

    const sanitizeFileName = (fileName) => {
      return encodeURIComponent(fileName).replace(/['()]/g, escape).replace(/\*/g, '%2A');
    };

    outputStream.on("finish", async () => {
      console.log("PDF File saved successfully:", outputPath);

      const sanitizedFileName = sanitizeFileName(outputFileName);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${sanitizedFileName}"`);

      res.json({
        message: "File converted and zipped successfully",
        path: `/${convertedDir}/${sanitizedFileName}`,
        name: sanitizedFileName,
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
      console.error("Error saving file", err);
      res.status(500).send("Error saving file");
    });
  } catch (error) {
    console.error("Conversion error:", error);
    res.status(500).send({ message: "Error occurred during conversion.", details: error.toString() });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
