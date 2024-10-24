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

const DIRS = {
  upload: "uploads",
  converted: "converted",
};

const fileUtils = {
  ensureDir: (dirPath) => {
    !fs.existsSync(dirPath) && fs.mkdirSync(dirPath);
  },

  needsConversion: (file) => {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const isWord = [".doc", ".docx"].includes(fileExtension);
    const isScreenshot =
      (file.originalname.includes("오전") ||
        file.originalname.includes("오후")) &&
      (file.originalname.includes("10") ||
        file.originalname.includes("2") ||
        file.originalname.includes("7"));

    if (isScreenshot || fileExtension === ".pdf") return false;
    if (isWord) return true;
    return ![".jpg", ".jpeg", ".png"].includes(fileExtension);
  },
};

const formatDates = {
  attendance: (date) => dayjs(date).format("YYMMDD"),
  vacation: (date) => {
    const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
    const dateObj = dayjs(date);
    return `${dateObj.year()}년 ${dateObj.month() + 1}월 ${dateObj.date()}일 (${
      weekDays[dateObj.day()]
    })`;
  },
};

const pdfProcessor = {
  pdfServicesInstance: null,

  getPDFServices: (credentials) => {
    if (!pdfProcessor.pdfServicesInstance) {
      pdfProcessor.pdfServicesInstance = new PDFServices({ credentials });
    }
    return pdfProcessor.pdfServicesInstance;
  },

  addSignature: async (pdfPath, signaturePath) => {
    const pdfDoc = await PDFDocument.load(fs.readFileSync(pdfPath), {
      updateMetadata: false,
    });

    const pngImage = await pdfDoc.embedPng(fs.readFileSync(signaturePath));
    pdfDoc
      .getPages()[0]
      .drawImage(pngImage, { x: 430, y: 430, width: 80, height: 30 });

    const signedPdfPath = path.join(
      __dirname,
      DIRS.converted,
      "signed_output.pdf"
    );
    fs.writeFileSync(
      signedPdfPath,
      await pdfDoc.save({ updateMetadata: false })
    );

    return signedPdfPath;
  },

  convertToPDF: async (docInfo, credentials) => {
    if (docInfo.type === "original" && path.extname(docInfo.path) === ".pdf") {
      return {
        path: `/converted/${path.basename(docInfo.path)}`,
        name: path.basename(docInfo.path),
      };
    }

    const pdfServices = pdfProcessor.getPDFServices(credentials);

    try {
      const readStream = fs.createReadStream(docInfo.path);

      const inputAsset = await pdfServices.upload({
        readStream,
        mimeType: MimeType.DOCX,
      });

      const job = new CreatePDFJob({ inputAsset });

      const [pollingURL, outputFileName] = await Promise.all([
        pdfServices.submit({ job }),
        Promise.resolve(`${path.basename(docInfo.path, ".docx")}.pdf`),
      ]);

      const {
        result: { asset: resultAsset },
      } = await pdfServices.getJobResult({
        pollingURL,
        resultType: CreatePDFResult,
      });

      const streamAsset = await pdfServices.getContent({ asset: resultAsset });
      const finalOutputPath = path.join(
        __dirname,
        DIRS.converted,
        outputFileName
      );

      await new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(finalOutputPath, {
          flags: "w",
          encoding: "binary",
        });

        streamAsset.readStream
          .pipe(writeStream)
          .on("finish", () => {
            writeStream.end();
            resolve(finalOutputPath);
          })
          .on("error", (error) => {
            writeStream.end();
            reject(error);
          });
      });

      return finalOutputPath;
    } catch (error) {
      console.error("PDF conversion error:", error);
      throw new Error(`PDF conversion failed: ${error.message}`);
    }
  },

  processFiles: async (filledDocPaths, credentials) => {
    const processFile = async (docInfo) => {
      try {
        const finalOutputPath = await pdfProcessor.convertToPDF(
          docInfo,
          credentials
        );

        const outputPath =
          docInfo.type === "attendance"
            ? await pdfProcessor.addSignature(
                finalOutputPath,
                path.join(__dirname, DIRS.upload, "sign.png")
              )
            : finalOutputPath;

        return {
          path: `/converted/${path.basename(outputPath)}`,
          name: path.basename(outputPath),
        };
      } catch (error) {
        console.error(`Error processing file ${docInfo.path}:`, error);
        throw error;
      }
    };

    return Promise.all(filledDocPaths.map(processFile));
  },
};

const documentGenerator = {
  fillAttendanceForm: async (values) => {
    const templatePath = path.join(
      __dirname,
      "templates",
      "attendance_template.docx"
    );
    if (!fs.existsSync(templatePath)) {
      throw new Error("Attendance template file not found");
    }

    const doc = new Docxtemplater(
      new PizZip(fs.readFileSync(templatePath, "binary")),
      {
        paragraphLoop: true,
        linebreaks: true,
      }
    );

    doc.render({
      date: formatDates.attendance(values.date),
      applicationDate: dayjs().format("YYMMDD"),
      name: values.name,
      checkInTime: values.checkInTime,
      checkOutTime: values.checkOutTime,
      reason:
        values.conversionType === "vacation"
          ? "휴가"
          : values.conversionType === "officialLeave"
          ? "공가"
          : values.reason,
    });

    const outputPath = path.join(
      __dirname,
      DIRS.converted,
      "filled_attendance.docx"
    );
    fs.writeFileSync(outputPath, doc.getZip().generate({ type: "nodebuffer" }));

    return outputPath;
  },

  fillVacationForm: async (values) => {
    const templatePath = path.join(
      __dirname,
      "templates",
      "vacation_template.docx"
    );
    if (!fs.existsSync(templatePath)) {
      throw new Error("Vacation template file not found");
    }

    const doc = new Docxtemplater(
      new PizZip(fs.readFileSync(templatePath, "binary")),
      {
        paragraphLoop: true,
        linebreaks: true,
      }
    );

    doc.render({
      name: values.name,
      vacationDate: formatDates.vacation(values.date),
      courseContent: values.courseContent || "",
      studyPlan: values.studyPlan || "",
      significant: values.significant || "",
    });

    const outputPath = path.join(
      __dirname,
      DIRS.converted,
      "filled_vacation_plan.docx"
    );
    fs.writeFileSync(outputPath, doc.getZip().generate({ type: "nodebuffer" }));

    return outputPath;
  },
};

const app = express();
const upload = multer({ dest: path.join(__dirname, DIRS.upload) });

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(
  `/${DIRS.converted}`,
  express.static(path.join(__dirname, DIRS.converted))
);

[DIRS.upload, DIRS.converted].forEach((dir) =>
  fileUtils.ensureDir(path.join(__dirname, dir))
);

app.post("/sign", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");

  try {
    const filePath = path.join(__dirname, DIRS.upload, "sign.png");
    await sharp(req.file.path).resize(520, 100).toFile(filePath);

    res.status(200).json({
      message: "Signature file uploaded and resized successfully",
      path: filePath,
    });
  } catch (err) {
    console.error("Error resizing signature file:", err);
    res.status(500).send("Error resizing signature file");
  }
});

app.post("/convert", upload.single("file"), async (req, res) => {
  try {
    const filledDocPaths = [];
    const isLeaveRequest = ["vacation", "officialLeave"].includes(
      req.body.conversionType
    );

    if (isLeaveRequest) {
      if (req.body.conversionType === "vacation") {
        filledDocPaths.push({
          path: await documentGenerator.fillVacationForm(req.body),
          type: "vacation",
        });
      }

      filledDocPaths.push({
        path: await documentGenerator.fillAttendanceForm({
          ...req.body,
          checkInTime: "",
          checkOutTime: "",
        }),
        type: "attendance",
      });
    } else if (req.file) {
      if (fileUtils.needsConversion(req.file)) {
        filledDocPaths.push({
          path: await documentGenerator.fillAttendanceForm(req.body),
          type: "attendance",
        });
      } else {
        const outputPath = path.join(
          __dirname,
          DIRS.converted,
          `original${path.extname(req.file.originalname)}`
        );
        fs.copyFileSync(req.file.path, outputPath);
        filledDocPaths.push({ path: outputPath, type: "original" });
      }
    }

    const credentials = new ServicePrincipalCredentials({
      clientId: process.env.PDF_SERVICES_CLIENT_ID,
      clientSecret: process.env.PDF_SERVICES_CLIENT_SECRET,
      organizationId: process.env.PDF_SERVICES_ORG_ID,
    });

    const processedFiles = await pdfProcessor.processFiles(
      filledDocPaths,
      credentials
    );

    res.json({
      message: "Files processed successfully",
      files: processedFiles,
    });

    setTimeout(async () => {
      filledDocPaths.forEach((docInfo) => {
        fs.existsSync(docInfo.path) &&
          fs.promises.unlink(docInfo.path).catch(() => {});
      });

      [DIRS.upload, DIRS.converted].forEach(async (dir) => {
        const dirPath = path.join(__dirname, dir);
        const files = await fs.promises.readdir(dirPath);
        files.forEach((file) => {
          const filePath = path.join(dirPath, file);
          fs.promises.unlink(filePath).catch(() => {});
        });
      });
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
app.listen(port, () => console.log(`Server running on port ${port}`));
