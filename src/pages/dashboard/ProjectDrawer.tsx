import React, { useState, useEffect } from "react";
import {
  Drawer,
  Form,
  Input,
  Button,
  Upload,
  Space,
  Typography,
  message,
  type UploadFile,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { showErrorToast, showSuccessToast } from "../../utils/toaster";
import type { studentType } from "../../services/studentService";
import { createBulkProject } from "../../services/projectService";
const apiUrl = import.meta.env.VITE_API_URL;

const { Title } = Typography;

interface ProjectData {
  id: number;
  name: string;
  techskill: string;
  status: string;
  duration: string;
  sourcecodelink: string;
  certificate?: UploadFile;
}

interface ChildProps {
  openProject: boolean;
  handleProjectClose: () => void;
  handleProjectOpen: () => void;
  student: studentType;
  fetchUser: () => void;
}

const ProjectDrawer: React.FC<ChildProps> = ({
  openProject,
  handleProjectClose,
  student,
  fetchUser,
}) => {
  const [formList, setFormList] = useState<ProjectData[]>([
    {
      name: "",
      techskill: "",
      status: "",
      duration: "",
      sourcecodelink: "",
      certificate: undefined,
      id: 0,
    },
  ]);

  const handleDeleteProject = (index: number) => {
    setFormList((prev) => prev.filter((_, i) => i !== index));
  };

  // Update your useEffect for initial data loading
  useEffect(() => {
    if (openProject) {
      if (student?.projects?.length) {
        const initialProjects = student.projects.map((project) => ({
          id: project.id,
          name: project.name || "",
          techskill: project.techskill || "",
          status: project.status || "",
          duration: project.duration || "",
          sourcecodelink: project?.sourcecodelink || "",
          certificate: project?.projectPath
            ? {
                uid: `-${project.id}`,
                name:
                  project.filename ||
                  project.projectPath?.split(/[\\/]/).pop() ||
                  "certificate",
                status: "done" as const,
                url: `${apiUrl}/${project?.projectPath
                  .replace(/\\/g, "/")
                  .replace(/^\/+/, "")}`,
                originFileObj: undefined,
                response: {
                  path: project?.projectPath,
                  filename: project?.filename,
                },
              }
            : undefined,
        }));
        setFormList(initialProjects);
      } else {
        setFormList([
          {
            name: "",
            techskill: "",
            status: "",
            duration: "",
            sourcecodelink: "",
            certificate: undefined,
            id: 0,
          },
        ]);
      }
    }
  }, [openProject, student]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleView = (proj: any) => {
    const file = proj.certificate;

    if (!file) {
      message.error("No file available to view");
      return;
    }

    let fileURL: string | undefined;

    // Case 1: Newly uploaded file (has originFileObj)
    if (
      file instanceof File ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (file as any).originFileObj instanceof File
    ) {
      const fileObj =
        file instanceof File
          ? file
          : // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (file as any).originFileObj;
      fileURL = URL.createObjectURL(fileObj);
    }
    // Case 2: File from server response (has URL)
    else if (file.url) {
      // Ensure URL is absolute (prepend apiUrl if it's a relative path)
      fileURL = file.url.startsWith("http")
        ? file.url
        : `${apiUrl}/${file.url.replace(/^\/+/, "")}`;
    }
    // Case 3: File from DB (path in response object)
    else if (file.response?.path) {
      const normalizedPath = file.response.path
        .replace(/\\/g, "/")
        .replace(/^\/+/, "");
      fileURL = `${apiUrl}/${normalizedPath}`;
    }
    // Case 4: File has thumbUrl (for images)
    else if (file.thumbUrl) {
      fileURL = file.thumbUrl;
    }

    if (fileURL) {
      // Clean up any double slashes in the URL
      fileURL = fileURL.replace(/([^:]\/)\/+/g, "$1");
      window.open(fileURL, "_blank");
    } else {
      message.error("Cannot open file - no valid file source available");
      console.error("File object structure:", file);
    }
  };

  const handleAddProject = () => {
    setFormList([
      ...formList,
      {
        name: "",
        techskill: "",
        status: "",
        duration: "",
        sourcecodelink: "",
        certificate: undefined,
        id: 0,
      },
    ]);
  };

  const handleChange = (
    index: number,
    key: keyof ProjectData,
    value: string | UploadFile
  ) => {
    const newList = [...formList];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (newList[index][key] as any) = value;
    setFormList(newList);
  };

  const handleSubmit = async () => {
    const hasEmptyFields = formList.some(
      (proj) =>
        !proj.name ||
        !proj.techskill ||
        !proj.status ||
        !proj.duration ||
        !proj.sourcecodelink
    );
    if (hasEmptyFields) {
      showErrorToast("Please fill in all fields for every project.");
      return;
    }

    const projectFormData = new FormData();
    let projectFileIndex = 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const projectDatas = formList.map((project: any) => {
      let projectFilePath = null;
      let projectFileFlag = null;
      let fileIndex = null;


      if (project?.certificate) {
        projectFormData.append("files", project.certificate);
        projectFilePath = project?.certificate?.response?.path
          ? project.certificate.response.path.replace(/\\\\/g, "\\")
          : "";
        projectFileFlag = project?.certificate?.response?.filename
          ? project.certificate.response.filename
          : "";
        if (!project?.certificate?.response) {
          fileIndex = projectFileIndex++;
        }
      } else if (project.projectFile?.projectPath) {
        projectFilePath = project?.projectFile?.projectPath;
        projectFileFlag = project?.projectFile?.projectPath;
      }

      return {
        name: project.name,
        techskill: project.techskill,
        status: project.status || null,
        duration: project.duration || null,
        sourcecodelink: project.sourcecodelink,
        student_id: student.id,
        projectFile: projectFileFlag,
        projectFilePath,
        fileIndex: fileIndex !== null ? fileIndex : undefined,
        id: project.id,
      };
    });

    projectFormData.append("projectDatas", JSON.stringify(projectDatas));
    projectFormData.append("student_id", student.id.toString());

    await createBulkProject(projectFormData);
    await fetchUser();
    showSuccessToast("All projects submitted successfully!");
    handleProjectClose();
  };

  const handleCancel = () => {
    setFormList([
      {
        name: "",
        techskill: "",
        status: "",
        duration: "",
        sourcecodelink: "",
        certificate: undefined,
        id: 0,
      },
    ]);
    handleProjectClose();
  };

  return (
    <>
      <Drawer
        title={
          <Space
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              Projects
            </Title>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={handleAddProject}
            ></Button>
          </Space>
        }
        placement="right"
        width={550}
        onClose={handleCancel}
        open={openProject}
        footer={
          <div style={{ textAlign: "right" }}>
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        }
      >
        {formList.map((proj, index) => (
          <Form layout="vertical" key={index}>
            <Space
              style={{ display: "flex", justifyContent: "space-between" }}
              align="center"
            >
              <Title level={5}>Project {index + 1}</Title>
              <Button
                type="text"
                icon={<DeleteOutlined style={{ color: "red" }} />}
                onClick={() => handleDeleteProject(index)}
                danger
              />
            </Space>
            <Form.Item label="Name of the Project" required>
              <Input
                value={proj.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Tech Stack" required>
              <Input
                value={proj.techskill}
                onChange={(e) =>
                  handleChange(index, "techskill", e.target.value)
                }
              />
            </Form.Item>

            <Form.Item label="Status" required>
              <Input
                value={proj.status}
                onChange={(e) => handleChange(index, "status", e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Duration" required>
              <Input.TextArea
                rows={2}
                value={proj.duration}
                onChange={(e) =>
                  handleChange(index, "duration", e.target.value)
                }
              />
            </Form.Item>

            <Form.Item label="Code Source Link" required>
              <Input
                value={proj.sourcecodelink}
                onChange={(e) =>
                  handleChange(index, "sourcecodelink", e.target.value)
                }
              />
            </Form.Item>

            <Form.Item label="Add Certificate">
              <Upload
                beforeUpload={(file) => {
                  const isAllowedType =
                    file.type === "application/pdf" ||
                    file.type.startsWith("image/");
                  if (!isAllowedType) {
                    message.error("Only images and PDF files are allowed!");
                    return Upload.LIST_IGNORE;
                  }
                  handleChange(index, "certificate", file);
                  return false; // prevent automatic upload
                }}
                maxCount={1}
                showUploadList={false}
                accept=".png,.jpg,.jpeg,.gif,.bmp,.webp,.pdf"
              >
                <Button icon={<UploadOutlined />}>Upload Certificate</Button>
              </Upload>
              {proj.certificate && (
                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {proj.certificate.type === "application/pdf" ? (
                    <FilePdfOutlined
                      style={{ fontSize: 24, color: "#d32029" }}
                    />
                  ) : (
                    <FileImageOutlined
                      style={{ fontSize: 24, color: "#1890ff" }}
                    />
                  )}
                  <span style={{ flex: 1 }}>{proj.certificate.name}</span>
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => {
                      handleView(proj);
                    }}
                  >
                    View
                  </Button>
                </div>
              )}
            </Form.Item>

            <div style={{ borderBottom: "1px solid #ddd", marginBottom: 16 }} />
          </Form>
        ))}
      </Drawer>
    </>
  );
};

export default ProjectDrawer;
