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

const cachedTemplates = {
  attendance: fs.readFileSync(
    path.join(__dirname, "templates", "attendance_template.docx"),
    "binary"
  ),
  vacation: fs.readFileSync(
    path.join(__dirname, "templates", "vacation_template.docx"),
    "binary"
  ),
  finalVacation: fs.readFileSync(
    path.join(__dirname, "templates", "final_vacation_template.docx"),
    "binary"
  ),
};

const fileUtils = {
  ensureDir: (dirPath) => {
    !fs.existsSync(dirPath) && fs.mkdirSync(dirPath);
  },

  needsConversion: (file) => {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const fileName = file.originalname.toLowerCase();

    if (fileName.includes("출석대장")) {
      return true;
    }

    if (
      (fileName.includes("오전") || fileName.includes("오후")) &&
      (fileName.includes("10") ||
        fileName.includes("2") ||
        fileName.includes("7"))
    ) {
      return false;
    }

    const noConversionExtensions = [".jpg", ".jpeg", ".png", ".pdf"];
    return !noConversionExtensions.includes(fileExtension);
  },
};

const formatDates = {
  attendance: (date) => {
    return dayjs(date).add(9, "hour").format("YYMMDD");
  },
  vacation: (date) => {
    const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
    const dateObj = dayjs(date).add(9, "hour");
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
      .drawImage(pngImage, { x: 437, y: 433, width: 70, height: 30 });

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
    const tasks = filledDocPaths.map(async (docInfo) => {
      try {
        let finalOutputPath;
        finalOutputPath = await pdfProcessor.convertToPDF(docInfo, credentials);

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
    });

    return await Promise.all(Array.isArray(tasks) ? tasks : [tasks]);
  },
};

const documentGenerator = {
  fillAttendanceForm: async (values) => {
    const doc = new Docxtemplater(new PizZip(cachedTemplates.attendance), {
      paragraphLoop: true,
      linebreaks: true,
    });

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
    const doc = new Docxtemplater(new PizZip(cachedTemplates.vacation), {
      paragraphLoop: true,
      linebreaks: true,
    });

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

  fillFinalVacationForm: async (values) => {
    const doc = new Docxtemplater(new PizZip(cachedTemplates.finalVacation), {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.render({
      name: values.name,
      vacationDate: formatDates.vacation(values.date),
      courseContent: values.courseContent || "",
      currentTasks: values.currentTasks || "",
      taskAdjustments: values.taskAdjustments || "",
      workPlan: values.workPlan || "",
      significant: values.significant || "",
    });

    const outputPath = path.join(
      __dirname,
      DIRS.converted,
      "filled_final_vacation_plan.docx"
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
    await sharp(req.file.path).resize(520, 160).toFile(filePath);

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
    const isLeaveRequest = [
      "vacation",
      "officialLeave",
      "finalVacation",
    ].includes(req.body.conversionType);

    if (isLeaveRequest) {
      if (req.body.conversionType === "vacation") {
        filledDocPaths.push({
          path: await documentGenerator.fillVacationForm(req.body),
          type: "vacation",
        });
        filledDocPaths.push({
          path: await documentGenerator.fillAttendanceForm({
            ...req.body,
            checkInTime: "",
            checkOutTime: "",
            reason: "휴가",
          }),
          type: "attendance",
        });
      } else if (req.body.conversionType === "finalVacation") {
        filledDocPaths.push({
          path: await documentGenerator.fillFinalVacationForm(req.body),
          type: "finalVacation",
        });
        filledDocPaths.push({
          path: await documentGenerator.fillAttendanceForm({
            ...req.body,
            checkInTime: "",
            checkOutTime: "",
            reason: "휴가",
          }),
          type: "attendance",
        });
      } else {
        filledDocPaths.push({
          path: await documentGenerator.fillAttendanceForm({
            ...req.body,
            checkInTime: "",
            checkOutTime: "",
          }),
          type: "attendance",
        });
      }
    } else if (req.file) {
      if (fileUtils.needsConversion(req.file)) {
        filledDocPaths.push({
          path: await documentGenerator.fillAttendanceForm(req.body),
          type: "attendance",
        });
      } else {
        const originalFileName = `original_${Date.now()}${path.extname(
          req.file.originalname
        )}`;
        const outputPath = path.join(
          __dirname,
          DIRS.converted,
          originalFileName
        );
        fs.copyFileSync(req.file.path, outputPath);
        filledDocPaths.push({ path: outputPath, type: "original" });
      }
    }

    if (filledDocPaths.length === 0) {
      return res.status(400).send("No files to process.");
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
      await Promise.all(
        filledDocPaths.map(async (docInfo) => {
          if (docInfo.path && fs.existsSync(docInfo.path)) {
            await fs.promises.unlink(docInfo.path).catch(() => {});
          }
        })
      );

      await Promise.all(
        [DIRS.upload, DIRS.converted].map(async (dir) => {
          const dirPath = path.join(__dirname, dir);
          const files = await fs.promises.readdir(dirPath);
          return Promise.all(
            files.map((file) =>
              fs.promises.unlink(path.join(dirPath, file)).catch(() => {})
            )
          );
        })
      );
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
