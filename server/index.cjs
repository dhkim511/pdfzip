const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const dotenv = require("dotenv");
const sharp = require("sharp");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const ImageModule = require("docxtemplater-image-module-free");
const {
  PDFServices,
  ServicePrincipalCredentials,
  MimeType,
  CreatePDFJob,
  CreatePDFResult,
} = require("@adobe/pdfservices-node-sdk");
const { PDFDocument } = require("pdf-lib");

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
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${year}${month}${day}`;
};

async function addSignatureToPDF(pdfPath, signaturePath) {
  const existingPdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  const pngImageBytes = fs.readFileSync(signaturePath);
  const pngImage = await pdfDoc.embedPng(pngImageBytes);

  firstPage.drawImage(pngImage, {
    x: 430,
    y: 430,
    width: 80,
    height: 30,
  });

  const pdfBytes = await pdfDoc.save();
  const signedPdfPath = path.join(__dirname, convertedDir, "signed_output.pdf");
  fs.writeFileSync(signedPdfPath, pdfBytes);

  return signedPdfPath;
}

const fillAttendanceForm = async (values) => {
  const templatePath = path.join(
    __dirname,
    "templates",
    "attendance_template.docx"
  );
  const content = fs.readFileSync(templatePath, "binary");

  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  const applicationDate = formatDateYYMMDD(new Date());

  const data = {
    date: values.date,
    applicationDate,
    name: values.name,
    checkInTime: values.checkInTime,
    checkOutTime: values.checkOutTime,
    reason: values.reason,
  };

  doc.setData(data);

  try {
    doc.render();
  } catch (error) {
    console.error("Error during template processing:", error);
    throw error;
  }

  const buffer = doc.getZip().generate({ type: "nodebuffer" });
  const outputPath = path.join(
    __dirname,
    convertedDir,
    "filled_attendance.docx"
  );
  fs.writeFileSync(outputPath, buffer);

  return outputPath;
};

app.post("/sign", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const file = req.file;
  const fileName = "sign.png";
  const filePath = path.join(__dirname, uploadDir, fileName);

  sharp(file.path)
    .resize(520, 100)
    .toFile(filePath, (err) => {
      if (err) {
        console.error("Error resizing signature file:", err);
        return res.status(500).send("Error resizing signature file");
      }

      console.log(
        "Signature file resized and saved successfully at:",
        filePath
      );
      res.status(200).json({
        message: "Signature file uploaded and resized successfully",
        path: filePath,
      });
    });
});

app.post("/convert", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

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

    outputStream.on("finish", async () => {
      console.log("PDF File saved successfully:", outputPath);

      const signedPdfPath = await addSignatureToPDF(
        outputPath,
        path.join(__dirname, uploadDir, "sign.png")
      );

      const signedPdfUrl = `/converted/signed_output.pdf`;

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${path.basename(signedPdfPath)}"`
      );

      res.json({
        message: "PDF with signature generated successfully",
        path: signedPdfUrl,
        name: path.basename(signedPdfPath),
      });

      setTimeout(async () => {
        try {
          if (fs.existsSync(outputPath)) {
            await fs.promises.unlink(outputPath);
          }
        } catch (error) {
          console.error("Error deleting file", error);
        }
      }, 60000);
    });

    outputStream.on("error", (err) => {
      console.error("Error saving file", err);
      res.status(500).send("Error saving file");
    });
  } catch (error) {
    console.error("Conversion error:", error);
    res.status(500).send({
      message: "Error occurred during conversion.",
      details: error.toString(),
    });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
