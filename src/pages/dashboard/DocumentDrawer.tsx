import React, { useState } from "react";
import {
  Drawer,
  Button,
  Input,
  Upload,
  Form,
  Typography,
  Space,
  Divider,
  message,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import { createdocument } from "../../services/documentService";

const { Title, Text } = Typography;

interface DrawerType {
  open: boolean;
  handleClose: () => void;
  handleOpen: () => void;
}

const DocumentDrawer: React.FC<DrawerType> = ({
  open,
  handleClose,
  handleOpen,
}) => {
  const [marksheets, setMarksheets] = useState<{ name: string; file?: File }[]>(
    [{ name: "10th Marksheet" }, { name: "12th Marksheet" }]
  );

  const [certificates, setCertificates] = useState<
    { name: string; file?: File }[]
  >([{ name: "Coursera Python Certification" }]);
  const [resume, setResume] = useState<{ name: string; file?: File } | null>(
    null
  );
  const [resumeName, setResumeName] = useState<string>("");

  const [newMarksheet, setNewMarksheet] = useState<string>("");
  const [newCertificate, setNewCertificate] = useState<string>("");

  const addMarksheet = () => {
    if (newMarksheet.trim()) {
      setMarksheets([...marksheets, { name: newMarksheet }]);
      setNewMarksheet("");
    }
  };

  const addCertificate = () => {
    if (newCertificate.trim()) {
      setCertificates([...certificates, { name: newCertificate }]);
      setNewCertificate("");
    }
  };

  // Handle file upload
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpload = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info: any,
    index: number,
    type: "marksheet" | "certificate" | "resume"
  ) => {
    const file = info.file.originFileObj || info.file; // Directly get the file
    if (file) {
      console.log("inside"); // This will now trigger

      if (type === "marksheet") {
        const updatedMarksheets = [...marksheets];
        updatedMarksheets[index].file = file;
        setMarksheets(updatedMarksheets);
      } else if (type === "certificate") {
        const updatedCertificates = [...certificates];
        updatedCertificates[index].file = file;
        setCertificates(updatedCertificates);
      } else if (type === "resume") {
        setResume({ name: file.name, file });
        setResumeName(file.name); // Set file name in state
      }

      message.success(`${file.name} uploaded successfully`);
    }
  };

  const props: UploadProps = {
    beforeUpload: () => false, // Prevent auto-upload
    maxCount: 1,
  };
  const handleSave = async () => {
    const formData = new FormData();

    const maxiviuData = localStorage.getItem("komaxiviustudent");
    let student_id = "";
    if (maxiviuData) {
      try {
        const parsedData = JSON.parse(maxiviuData);
        student_id = parsedData.studentid || ""; // adjust key if different
      } catch (error) {
        console.error("Failed to parse maxiviu data from localStorage", error);
      }
    }

    formData.append("student_id", student_id);

    // Append resume if available
    if (resume?.file) {
      formData.append("resume", resume.file, resume.file.name);
    }

    // Append marksheets
    marksheets.forEach((item, index) => {
      if (item.file) {
        formData.append(`marksheet_${index}`, item.file, item.file.name);
      }
    });

    // Append certifications
    certificates.forEach((item, index) => {
      if (item.file) {
        formData.append(`certificate_${index}`, item.file, item.file.name);
      }
    });

    try {
      await createdocument(formData);
      message.success("Documents uploaded successfully");
      handleClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      message.error("Error uploading documents");
    }
  };

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => handleOpen()}
      >
        Open Drawer
      </Button>
      <Drawer
        title={
          <Space>
            <ArrowLeftOutlined onClick={() => handleClose()} />
            <Text>Documents</Text>
          </Space>
        }
        placement="right"
        width={600}
        onClose={() => handleClose()}
        open={open}
      >
        <Form layout="vertical">
          {/* Resume Section */}
          <Title level={5}>
            Resume{" "}
            <span style={{ fontSize: "0.8rem" }}>format .docx, .pdf</span>
          </Title>
          <Form.Item>
            <Space style={{ display: "flex", alignItems: "center" }}>
              <Input
                placeholder="Resume Name"
                value={resumeName}
                onChange={(e) => setResumeName(e.target.value)}
                style={{ flex: 1 }}
              />
              <Upload
                {...props}
                onChange={(info) => handleUpload(info, 0, "resume")}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Space>
          </Form.Item>

          <Divider />

          {/* Marksheet Section */}
          <Title level={5}>Marksheet</Title>
          <Form.Item>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Input
                placeholder="Type of Marksheet"
                value={newMarksheet}
                onChange={(e) => setNewMarksheet(e.target.value)}
                style={{ flex: 1 }}
              />
              <PlusCircleOutlined
                onClick={addMarksheet}
                style={{ fontSize: "20px", cursor: "pointer" }}
              />
            </div>
          </Form.Item>
          <Space direction="vertical" style={{ width: "100%" }}>
            {marksheets.map((item, index) => (
              <Space
                key={index}
                style={{ width: "100%", justifyContent: "space-between" }}
              >
                <Input placeholder={item.name} style={{ flex: 1 }} />
                <Upload
                  {...props}
                  onChange={(info) => handleUpload(info, index, "marksheet")}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Space>
            ))}
          </Space>

          <Divider />

          {/* Professional Certifications */}
          <Title level={5}>Professional Certifications</Title>
          <Form.Item>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Input
                placeholder="Type of Certification"
                value={newCertificate}
                onChange={(e) => setNewCertificate(e.target.value)}
                style={{ flex: 1 }}
              />
              <PlusCircleOutlined
                onClick={addCertificate}
                style={{ fontSize: "20px", cursor: "pointer" }}
              />
            </div>
          </Form.Item>

          <Space direction="vertical" style={{ width: "100%" }}>
            {certificates.map((item, index) => (
              <Space
                key={index}
                style={{ width: "100%", justifyContent: "space-between" }}
              >
                <Input placeholder={item.name} style={{ flex: 1 }} />
                <Upload
                  {...props}
                  onChange={(info) => handleUpload(info, index, "certificate")}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Space>
            ))}
          </Space>

          <Divider />

          {/* Save Button */}
          <Button
            type="primary"
            block
            icon={<SaveOutlined />}
            style={{ marginTop: "1rem" }}
            onClick={handleSave}
          >
            Save
          </Button>
        </Form>
      </Drawer>
    </>
  );
};

export default DocumentDrawer;
