import React, { useState, useEffect } from "react";
import {
  Drawer,
  Button,
  Input,
  Upload,
  Form,
  Typography,
  Space,
  Divider,
  List,
  Tag,
  Modal,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  PlusCircleOutlined,
  EyeOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import { createdocument } from "../../services/documentService";
import { showSuccessToast, showErrorToast } from "../../utils/toaster";
import { userDatas } from "../../stores/userStore";
import config from "../../config/config";

const { Title, Text } = Typography;

interface DrawerType {
  open: boolean;
  handleClose: () => void;
  handleOpen: () => void;
}

interface DocumentItem {
  name: string;
  file?: File;
  fileName?: string;
  dbId?: number;
}

const DocumentDrawer: React.FC<DrawerType> = ({
  open,
  handleClose,
  handleOpen,
}) => {
  const [marksheets, setMarksheets] = useState<DocumentItem[]>([]);

  const [certificates, setCertificates] = useState<DocumentItem[]>([]);
  const [resume, setResume] = useState<DocumentItem | null>(null);
  const [resumeName, setResumeName] = useState<string>("");

  const [newMarksheet, setNewMarksheet] = useState<string>("");
  const [newCertificate, setNewCertificate] = useState<string>("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

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

  // const fetchDocumentFile = async (
  //   documentpath: string,
  //   filename: string
  // ): Promise<File> => {
  //    console.log(documentpath,"documentpath")
  //   const response = await fetch(documentpath);
  //   console.log(response,"responsenew")
  //   const blob = await response.blob();
  //   return new File([blob], filename, { type: blob.type });
  // };

  const fetchDocumentFile = async (
    documentpath: string,
    filename: string
  ): Promise<File> => {
    try {
      // Construct the complete URL
      const completeUrl = documentpath.startsWith("http")
        ? documentpath
        : `${config.backendUrl}/${documentpath}`;

      const response = await fetch(completeUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error fetching file: ${response.statusText}`);
      }

      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type });
    } catch (error) {
      console.error("Error fetching document file:", error);
      throw error;
    }
  };

  useEffect(() => {
    const loadDocuments = async () => {
      if (userDatas?.value?.documents) {
        try {
          // Process resume
          const userResume = userDatas.value.documents.find(
            (doc) => doc.type === "Resume"
          );
          if (userResume) {
            const resumeFile = await fetchDocumentFile(
              userResume.documentpath,
              userResume.filename
            );
            setResume({
              name: userResume.name,
              file: resumeFile,
              fileName: userResume.filename,
            });
            setResumeName(userResume.name);
          }

          // Process marksheets
          const userMarksheets = userDatas.value.documents.filter(
            (doc) => doc.type === "Marksheet"
          );
          const marksheetItems = await Promise.all(
            userMarksheets.map(async (marksheet) => {
              const file = await fetchDocumentFile(
                marksheet.documentpath,
                marksheet.filename
              );
              return {
                name: marksheet.name,
                file,
                fileName: marksheet.filename,
              };
            })
          );
          setMarksheets(marksheetItems);

          // Process certificates
          const userCertificates = userDatas.value.documents.filter(
            (doc) => doc.type === "Certification"
          );
          const certificateItems = await Promise.all(
            userCertificates.map(async (certificate) => {
              const file = await fetchDocumentFile(
                certificate.documentpath,
                certificate.filename
              );
              return {
                name: certificate.name,
                file,
                fileName: certificate.filename,
              };
            })
          );
          setCertificates(certificateItems);
        } catch (error) {
          console.error("Error loading documents", error);
          showErrorToast("Failed to load documents");
        }
      }
    };

    loadDocuments();
  }, [userDatas.value]);

  const handleUpload = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info: any,
    index: number,
    type: "marksheet" | "certificate" | "resume"
  ) => {
    const file = info.file.originFileObj || info.file;
    if (file) {
      if (type === "marksheet") {
        const updatedMarksheets = [...marksheets];
        updatedMarksheets[index] = {
          ...updatedMarksheets[index],
          file,
          fileName: file.name,
        };
        setMarksheets(updatedMarksheets);
      } else if (type === "certificate") {
        const updatedCertificates = [...certificates];
        updatedCertificates[index] = {
          ...updatedCertificates[index],
          file,
          fileName: file.name,
        };
        setCertificates(updatedCertificates);
      } else if (type === "resume") {
        setResume({
          name: resumeName || "Resume",
          file,
          fileName: file.name,
        });
      }

      showSuccessToast(`${file.name} uploaded successfully`);
    }
  };

  const handleRemove = (
    index: number,
    type: "marksheet" | "certificate" | "resume"
  ) => {
    if (type === "marksheet") {
      const updatedMarksheets = [...marksheets];
      updatedMarksheets[index] = {
        ...updatedMarksheets[index],
        file: undefined,
        fileName: undefined,
      };
      setMarksheets(updatedMarksheets);
    } else if (type === "certificate") {
      const updatedCertificates = [...certificates];
      updatedCertificates[index] = {
        ...updatedCertificates[index],
        file: undefined,
        fileName: undefined,
      };
      setCertificates(updatedCertificates);
    } else if (type === "resume") {
      setResume(null);
      setResumeName("");
    }
  };

  const handlePreview = async (item: DocumentItem) => {
    try {
      if (item.file) {
        setPreviewFile(item.file);
        setPreviewVisible(true);
      }
    } catch (error) {
      console.error("Error previewing file:", error);
      showErrorToast("Failed to preview file");
    }
  };
  const props: UploadProps = {
    beforeUpload: () => false,
    maxCount: 1,
    showUploadList: false,
  };

  const handleSave = async () => {
    // Validate that all documents have files uploaded
    const hasEmptyMarksheet = marksheets.some((item) => !item.file);
    const hasEmptyCertificate = certificates.some((item) => !item.file);
    const hasEmptyResume = !resume?.file;

    if (hasEmptyMarksheet || hasEmptyCertificate || hasEmptyResume) {
      showErrorToast("Please upload all required documents before saving");
      return;
    }

    const formData = new FormData();

    const maxiviuData = localStorage.getItem("komaxiviustudent");
    let student_id = "";
    if (maxiviuData) {
      try {
        const parsedData = JSON.parse(maxiviuData);
        student_id = parsedData.studentid || "";
      } catch (error) {
        console.error("Failed to parse maxiviu data from localStorage", error);
      }
    }

    formData.append("student_id", student_id);

    if (resume) {
      formData.append("resume_name", resume.name);
      if (resume.file) {
        formData.append("resume_file", resume.file, resume.file.name);
      }
    }

    // Append marksheets data
    marksheets.forEach((item, index) => {
      formData.append(`marksheets[${index}][name]`, item.name);
      if (item.file) {
        formData.append(
          `marksheets[${index}][file]`,
          item.file,
          item.file.name
        );
      }
    });

    // Append certifications data
    certificates.forEach((item, index) => {
      formData.append(`certificates[${index}][name]`, item.name);
      if (item.file) {
        formData.append(
          `certificates[${index}][file]`,
          item.file,
          item.file.name
        );
      }
    });

    try {
      await createdocument(formData);
      showSuccessToast("Documents uploaded successfully");
      handleClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showErrorToast("Error uploading documents");
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
                required
              />
              <Upload
                {...props}
                onChange={(info) => handleUpload(info, 0, "resume")}
                disabled={!resumeName.trim()}
                accept="image/*,application/pdf"
              >
                <Button icon={<UploadOutlined />} disabled={!resumeName.trim()}>
                  Upload
                </Button>
              </Upload>
            </Space>
            {resume?.file && (
              <div style={{ marginTop: 8 }}>
                <Tag
                  icon={<PaperClipOutlined />}
                  closable
                  onClose={() => handleRemove(0, "resume")}
                  style={{ padding: "4px 8px", marginRight: 8 }}
                >
                  {resume.fileName}
                </Tag>
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={() => handlePreview(resume)}
                  size="small"
                />
              </div>
            )}
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
          <List
            dataSource={marksheets}
            renderItem={(item, index) => (
              <List.Item>
                <Space style={{ width: "100%" }}>
                  <Input value={item.name} readOnly style={{ flex: 1 }} />
                  {item.file ? (
                    <Space>
                      <Tag
                        icon={<PaperClipOutlined />}
                        closable
                        onClose={() => handleRemove(index, "marksheet")}
                        style={{ padding: "4px 8px" }}
                      >
                        {item.fileName}
                      </Tag>
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handlePreview(item)}
                        size="small"
                      />
                    </Space>
                  ) : (
                    <Upload
                      {...props}
                      onChange={(info) =>
                        handleUpload(info, index, "marksheet")
                      }
                      disabled={!item.name.trim()}
                      accept="image/*,application/pdf"
                    >
                      <Button
                        icon={<UploadOutlined />}
                        disabled={!item.name.trim()}
                      >
                        Upload
                      </Button>
                    </Upload>
                  )}
                </Space>
              </List.Item>
            )}
          />

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

          <List
            dataSource={certificates}
            renderItem={(item, index) => (
              <List.Item>
                <Space style={{ width: "100%" }}>
                  <Input value={item.name} readOnly style={{ flex: 1 }} />
                  {item.file ? (
                    <Space>
                      <Tag
                        icon={<PaperClipOutlined />}
                        closable
                        onClose={() => handleRemove(index, "certificate")}
                        style={{ padding: "4px 8px" }}
                      >
                        {item.fileName}
                      </Tag>
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handlePreview(item)}
                        size="small"
                      />
                    </Space>
                  ) : (
                    <Upload
                      {...props}
                      onChange={(info) =>
                        handleUpload(info, index, "certificate")
                      }
                      disabled={!item.name.trim()}
                      accept="image/*,application/pdf"
                    >
                      <Button
                        icon={<UploadOutlined />}
                        disabled={!item.name.trim()}
                      >
                        Upload
                      </Button>
                    </Upload>
                  )}
                </Space>
              </List.Item>
            )}
          />

          <Divider />

          {(marksheets.some((item) => !item.file) ||
            certificates.some((item) => !item.file) ||
            !resume?.file) && (
            <div style={{ color: "red", marginBottom: "1rem" }}>
              <Text type="danger">Please upload all documents:</Text>
              <ul>
                {!resume?.file && <li>Resume</li>}
                {marksheets.map(
                  (item, index) =>
                    !item.file && (
                      <li key={`marksheet-${index}`}>{item.name}</li>
                    )
                )}
                {certificates.map(
                  (item, index) =>
                    !item.file && (
                      <li key={`certificate-${index}`}>{item.name}</li>
                    )
                )}
              </ul>
            </div>
          )}

          {/* Save Button */}
          <Button
            type="primary"
            block
            icon={<SaveOutlined />}
            style={{ marginTop: "1rem" }}
            onClick={handleSave}
            disabled={
              marksheets.some((item) => !item.file) ||
              certificates.some((item) => !item.file) ||
              !resume?.file
            }
          >
            Save
          </Button>
        </Form>

        {/* File Preview Modal */}
        <Modal
          open={previewVisible}
          title="File Preview"
          footer={null}
          onCancel={() => setPreviewVisible(false)}
          width="80%"
        >
          {previewFile && (
            <iframe
              title="file-preview"
              src={URL.createObjectURL(previewFile)}
              style={{ width: "100%", height: "500px", border: "none" }}
            />
          )}
        </Modal>
      </Drawer>
    </>
  );
};

export default DocumentDrawer;
