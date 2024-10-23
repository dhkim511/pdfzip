const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const dotenv = require("dotenv");
const sharp = require("sharp");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const {
  PDFServices,
  ServicePrincipalCredentials,
  MimeType,
  CreatePDFJob,
  CreatePDFResult,
} = require("@adobe/pdfservices-node-sdk");
const { PDFDocument } = require("pdf-lib");
const dayjs = require("dayjs");

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

const formatAttendanceDate = (date) => {
  return dayjs(date).format("YYMMDD");
};

const formatVacationDate = (date) => {
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const dateObj = dayjs(date);
  const weekDay = weekDays[dateObj.day()];
  return `${dateObj.year()}년 ${
    dateObj.month() + 1
  }월 ${dateObj.date()}일 (${weekDay})`;
};

async function addSignatureToPDF(pdfPath, signaturePath) {
  const existingPdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  const pngImageBytes = fs.readFileSync(signaturePath);
  const pngImage = await pdfDoc.embedPng(pngImageBytes);

  firstPage.drawImage(pngImage, { x: 430, y: 430, width: 80, height: 30 });

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
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

  const applicationDate = dayjs().format("YYMMDD");

  const data = {
    date: formatAttendanceDate(values.date),
    applicationDate,
    name: values.name,
    checkInTime: values.checkInTime,
    checkOutTime: values.checkOutTime,
    reason: values.conversionType === "vacation" ? "휴가" : values.reason,
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

const fillVacationForm = async (values) => {
  const templatePath = path.join(
    __dirname,
    "templates",
    "vacation_template.docx"
  );
  const content = fs.readFileSync(templatePath, "binary");

  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

  const data = {
    name: values.name,
    vacationDate: formatVacationDate(values.date),
    courseContent: values.courseContent,
    studyPlan: values.studyPlan,
    significant: values.significant || "",
  };

  doc.setData(data);

  try {
    doc.render();
  } catch (error) {
    console.error("Error during vacation template processing:", error);
    throw error;
  }

  const buffer = doc.getZip().generate({ type: "nodebuffer" });
  const outputPath = path.join(
    __dirname,
    convertedDir,
    "filled_vacation_plan.docx"
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
  try {
    const filledDocPaths = [];

    if (req.body.conversionType === "vacation") {
      const vacationFormPath = await fillVacationForm(req.body);
      filledDocPaths.push({ path: vacationFormPath, type: "vacation" });

      const attendanceFormPath = await fillAttendanceForm({
        ...req.body,
        checkInTime: "10:00",
        checkOutTime: "19:00",
      });
      filledDocPaths.push({ path: attendanceFormPath, type: "attendance" });
    } else {
      const filledDocPath = await fillAttendanceForm(req.body);
      filledDocPaths.push({ path: filledDocPath, type: "attendance" });
    }

    const processedFiles = [];
    const credentials = new ServicePrincipalCredentials({
      clientId: process.env.PDF_SERVICES_CLIENT_ID,
      clientSecret: process.env.PDF_SERVICES_CLIENT_SECRET,
      organizationId: process.env.PDF_SERVICES_ORG_ID,
    });

    const pdfServices = new PDFServices({ credentials });

    for (const docInfo of filledDocPaths) {
      const inputAsset = await pdfServices.upload({
        readStream: fs.createReadStream(docInfo.path),
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

      const outputFileName = `${path.basename(docInfo.path, ".docx")}.pdf`;
      const finalOutputPath = path.join(
        __dirname,
        convertedDir,
        outputFileName
      );

      await new Promise((resolve, reject) => {
        const outputStream = fs.createWriteStream(finalOutputPath);
        streamAsset.readStream.pipe(outputStream);
        outputStream.on("finish", resolve);
        outputStream.on("error", reject);
      });

      let signedPdfPath = finalOutputPath;
      if (docInfo.type === "attendance") {
        signedPdfPath = await addSignatureToPDF(
          finalOutputPath,
          path.join(__dirname, uploadDir, "sign.png")
        );
      }

      processedFiles.push({
        path: `/converted/${path.basename(signedPdfPath)}`,
        name: path.basename(signedPdfPath),
      });
    }

    res.json({
      message: "Files processed successfully",
      files: processedFiles,
    });

    setTimeout(async () => {
      for (const docInfo of filledDocPaths) {
        if (fs.existsSync(docInfo.path)) {
          await fs.promises.unlink(docInfo.path).catch(() => {});
        }
      }
    }, 60000);
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
