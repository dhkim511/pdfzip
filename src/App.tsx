import React, { useState } from "react";
import {
  Form,
  Select,
  Input,
  DatePicker,
  Button,
  Upload,
  message,
  Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile, UploadChangeParam } from "antd/es/upload/interface";
import type { Dayjs } from "dayjs";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const { Option } = Select;

interface FormValues {
  applicationType: "vacation" | "officialLeave" | "attendance";
  name: string;
  date: Dayjs;
  files: UploadFile[];
}

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const App: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isAttendanceScreenshot = (fileName: string): boolean => {
    return (
      (fileName.includes("오전") || fileName.includes("오후")) &&
      (fileName.includes("10") ||
        fileName.includes("2") ||
        fileName.includes("7"))
    );
  };

  const getSuffix = (
    fileName: string,
    type: FormValues["applicationType"]
  ): string => {
    if (type === "officialLeave") {
      if (fileName.includes("출석대장")) return "(출석대장)";
      return "(증빙서류)";
    }
    if (type === "vacation") {
      if (fileName.includes("출석대장")) return "(출석대장)";
      if (fileName.includes("휴가 사용 계획서")) return "(휴가계획서)";
    }
    if (type === "attendance") {
      if (fileName.includes("출석대장")) return "(출석대장)";
      return "(증빙서류)";
    }
    return "";
  };

  const getTypeSuffix = (type: FormValues["applicationType"]): string => {
    switch (type) {
      case "vacation":
        return "(휴가)";
      case "officialLeave":
        return "(공가)";
      case "attendance":
        return "(출결 정정)";
      default:
        return "";
    }
  };

  const formatDate = (date: Dayjs): string => {
    return date.format("YYMMDD");
  };

  const onFinish = async (values: FormValues) => {
    if (fileList.length === 0) {
      message.error("파일을 첨부해주세요.");
      return;
    }

    setIsLoading(true);
    const zip = new JSZip();

    try {
      const fileProcessingTasks = fileList.map(async (file) => {
        const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
        const suffix = getSuffix(file.name, values.applicationType);
        const isImage = ["jpg", "jpeg", "png"].includes(fileExtension);
        const isScreenshot = isAttendanceScreenshot(file.name);

        let fileName = file.name;

        if (!isScreenshot) {
          fileName = `${formatDate(
            values.date
          )}_데브캠프_프론트엔드 개발 4회차_${values.name}${suffix}`;
          if (isImage) {
            fileName += `.${fileExtension}`;
          } else {
            fileName += ".pdf";
          }
        }

        if (isImage) {
          const fileContent = await (file.originFileObj as File).arrayBuffer();
          zip.file(fileName, fileContent);
        } else {
          const formData = new FormData();
          formData.append("file", file.originFileObj as File);
          formData.append("type", values.applicationType);
          formData.append("fileName", fileName);

          const response = await fetch(`${SERVER_URL}/convert`, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          const fileResponse = await fetch(`${SERVER_URL}${result.path}`);
          if (!fileResponse.ok) {
            throw new Error(`File fetch error: ${fileResponse.status}`);
          }

          const blob = await fileResponse.blob();
          zip.file(fileName, blob);
        }
      });

      await Promise.all(fileProcessingTasks);

      const content = await zip.generateAsync({ type: "blob" });
      const typeSuffix = getTypeSuffix(values.applicationType);
      const formattedDate = formatDate(values.date);
      saveAs(
        content,
        `${formattedDate}_데브캠프_프론트엔드 개발 4회차_${values.name}${typeSuffix}.zip`
      );
    } catch (error) {
      message.error("오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (info: UploadChangeParam<UploadFile>) => {
    let newFileList = [...info.fileList];
    setFileList(newFileList);
  };

  const applicationType = Form.useWatch("applicationType", form);

  const handleDateLabel = (): string => {
    switch (applicationType) {
      case "vacation":
        return "휴가 예정 날짜";
      case "officialLeave":
        return "공가 날짜";
      case "attendance":
        return "정정 희망 날짜";
      default:
        return "날짜";
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f2f2f2",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "40px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
          position: "relative",
        }}
      >
        <Spin spinning={isLoading} tip="파일 처리 중..." size="default">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="applicationType"
              label={<span style={{ fontWeight: "bold" }}>신청 유형</span>}
              initialValue="attendance"
              rules={[{ required: true, message: "신청 유형을 선택해주세요" }]}
            >
              <Select>
                <Option value="attendance">출결 정정</Option>
                <Option value="vacation">휴가</Option>
                <Option value="officialLeave">공가</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="name"
              label={<span style={{ fontWeight: "bold" }}>이름</span>}
              rules={[{ required: true, message: "이름을 입력해주세요" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="date"
              label={
                <span style={{ fontWeight: "bold" }}>{handleDateLabel()}</span>
              }
              rules={[{ required: true, message: "날짜를 선택해주세요" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="files"
              label={<span style={{ fontWeight: "bold" }}>파일 첨부</span>}
              rules={[{ required: true, message: "파일을 첨부해주세요" }]}
            >
              <Upload
                beforeUpload={() => false}
                onChange={handleFileChange}
                multiple
                fileList={fileList}
                listType="picture"
              >
                <Button icon={<UploadOutlined />} style={{ width: "100%" }}>
                  파일 선택
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%", height: "48px" }}
                disabled={isLoading}
              >
                변환 및 압축
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    </div>
  );
};

export default App;
