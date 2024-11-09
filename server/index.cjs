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
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

dotenv.config();

const DIRS = {
  upload: "uploads",
  converted: "converted",
};

const COURSE_LIST = [
  {
    name: "데브캠프 프론트엔드 개발_1기(DEV_FE1)",
    short: "데브캠프 : 프론트엔드 개발",
    period: "2024-05-20 ~ 2024-12-13(4회차)",
    time: "10:00 ~ 19:00",
  },
  {
    name: "데브캠프 프론트엔드 개발_2기(DEV_FE2)",
    short: "데브캠프 : 프론트엔드 개발",
    period: "2024-09-23 ~ 2025-04-18(5회차)",
    time: "10:00 ~ 19:00",
  },
  {
    name: "AI 융합 백엔드 개발 부트캠프_1기(DEV_BE1)",
    short: "AI 융합 백엔드 개발 부트캠프",
    period: "2024-05-20 ~ 2024-12-13(1회차)",
    time: "10:00 ~ 19:00",
  },
  {
    name: "AI 융합 백엔드 개발 부트캠프_2기(DEV_BE2)",
    short: "AI 융합 백엔드 개발 부트캠프",
    period: "2024-09-23 ~ 2025-04-04 (2회차)",
    time: "10:00 ~ 19:00",
  },
  {
    name: "패스트캠퍼스 kernel 프론트엔드 개발 부트캠프(KFE1)",
    short: "프론트엔드 개발 중급 부트캠프",
    period: "2024-07-15 ~ 2025-01-10(7회차)",
    time: "10:00 ~ 19:00",
  },
  {
    name: "패스트캠퍼스 kernel 백엔드 개발 부트캠프(KBE2)",
    short: "백엔드 개발 부트캠프",
    period: "2024-07-15 ~ 2025-01-10(7회차)",
    time: "10:00 ~ 19:00",
  },
  {
    name: "AI Lab_5기(Upstage_AI 4기)",
    short: "AI(인공지능) Lab",
    period: "2024-07-16 ~ 2025-02-14(5회차)",
    time: "10:00 ~ 19:00",
  },
  {
    name: "AI Lab_6기(Upstage_AI 5기)",
    short: "AI(인공지능) Lab",
    period: "2024-09-23 ~ 2025-04-25(6회차)",
    time: "10:00 ~ 19:00",
  },
  {
    name: "PM(프로덕트 매니저) 부트캠프_7기",
    short: "프로덕트 매니저(PM) 부트캠프",
    period: "2024-10-14 ~ 2025-04-11(7회차)",
    time: "10:00 ~ 19:00",
  },
  {
    name: "패스트캠퍼스 UXUI 디자인 부트캠프 4기",
    short: "UXUI 디자인 부트캠프",
    period: "2024-10-14 ~ 2025-04-11(4회차)",
    time: "10:00 ~ 19:00",
  },
  {
    name: "데이터 분석 부트캠프_8기(BDA16)",
    short: "데이터 분석 부트캠프",
    period: "2024-08-19 ~ 2025-01-10(8회차)",
    time: "09:00 ~ 18:00",
  },
];

const findCourseInfo = (courseName) => {
  const course = COURSE_LIST.find((c) => c.name === courseName);
  if (!course) {
    throw new Error("과정 정보를 찾을 수 없습니다.");
  }
  return course;
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
    return dayjs(date).tz("Asia/Seoul").format("YYMMDD");
  },
  vacation: (date) => {
    const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
    const dateObj = dayjs(date).tz("Asia/Seoul");
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
    pdfDoc.getPages()[0].drawImage(pngImage, {
      x: 445,
      y: 430,
      width: 50,
      height: 20,
    });

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

    const courseInfo = findCourseInfo(values.courseType);

    doc.render({
      date: formatDates.attendance(values.date),
      applicationDate: dayjs().tz("Asia/Seoul").format("YYMMDD"),
      name: values.name,
      checkInTime: values.checkInTime,
      checkOutTime: values.checkOutTime,
      reason:
        values.conversionType === "vacation"
          ? "휴가"
          : values.conversionType === "officialLeave"
          ? "공가"
          : values.reason,
      course: courseInfo.short,
      coursePeriod: courseInfo.period,
      courseTime: courseInfo.time,
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

    const courseInfo = findCourseInfo(values.courseType);

    doc.render({
      name: values.name,
      vacationDate: formatDates.vacation(values.date),
      courseContent: values.courseContent || "",
      studyPlan: values.studyPlan || "",
      significant: values.significant || "",
      course: courseInfo.short,
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

    const courseInfo = findCourseInfo(values.courseType);

    doc.render({
      name: values.name,
      vacationDate: formatDates.vacation(values.date),
      courseContent: values.courseContent || "",
      currentTasks: values.currentTasks || "",
      taskAdjustments: values.taskAdjustments || "",
      workPlan: values.workPlan || "",
      significant: values.significant || "",
      course: courseInfo.short,
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
    await sharp(req.file.path)
      .resize(260, 100, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .toFile(filePath);

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
