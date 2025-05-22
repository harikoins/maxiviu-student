import React, { useState } from "react";
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
} from "@ant-design/icons";

const { Title } = Typography;

interface ProjectData {
  projectName: string;
  techStack: string;
  status: string;
  duration: string;
  codeLink: string;
  certificate?: UploadFile;
}

interface ChildProps {
  openProject: boolean;
  handleProjectClose: () => void;
  handleProjectOpen: () => void;
}

const ProjectDrawer: React.FC<ChildProps> = ({
  openProject,
  handleProjectClose,
  handleProjectOpen,
}) => {
  const [formList, setFormList] = useState<ProjectData[]>([
    {
      projectName: "",
      techStack: "",
      status: "",
      duration: "",
      codeLink: "",
      certificate: undefined,
    },
  ]);

  const handleAddProject = () => {
    setFormList([
      ...formList,
      {
        projectName: "",
        techStack: "",
        status: "",
        duration: "",
        codeLink: "",
        certificate: undefined,
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

  const handleSubmit = () => {
    const hasEmptyFields = formList.some(
      (proj) =>
        !proj.projectName ||
        !proj.techStack ||
        !proj.status ||
        !proj.duration ||
        !proj.codeLink
    );
    if (hasEmptyFields) {
      message.error("Please fill in all fields for every project.");
      return;
    }

    console.log("Submitted projects:", formList);
    message.success("All projects submitted successfully!");
    setFormList([
      {
        projectName: "",
        techStack: "",
        status: "",
        duration: "",
        codeLink: "",
        certificate: undefined,
      },
    ]);
    handleProjectClose();
  };

  const handleCancel = () => {
    setFormList([
      {
        projectName: "",
        techStack: "",
        status: "",
        duration: "",
        codeLink: "",
        certificate: undefined,
      },
    ]);
    handleProjectClose();
  };

  return (
    <>
      <Button type="primary" onClick={handleProjectOpen}>
        Open Drawer
      </Button>

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
            >
              Add
            </Button>
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
            <Title level={5}>Project {index + 1}</Title>
            <Form.Item
              label="Name of the Project"
              required
              name={`projectName_${index}`} // you can add a unique name for each input in a dynamic form
              rules={[{ required: true, message: "Please enter project name" }]}
            >
              <Input
                value={proj.projectName}
                onChange={(e) =>
                  handleChange(index, "projectName", e.target.value)
                }
              />
            </Form.Item>

            <Form.Item label="Tech Stack" required>
              <Input
                value={proj.techStack}
                onChange={(e) =>
                  handleChange(index, "techStack", e.target.value)
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
                value={proj.codeLink}
                onChange={(e) =>
                  handleChange(index, "codeLink", e.target.value)
                }
              />
            </Form.Item>

            <Form.Item label="Add Certificate">
              <Upload
                beforeUpload={(file) => {
                  console.log(file, "file");
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
                      const fileURL = URL.createObjectURL(
                        proj.certificate as unknown as Blob
                      );
                      window.open(fileURL, "_blank");
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
