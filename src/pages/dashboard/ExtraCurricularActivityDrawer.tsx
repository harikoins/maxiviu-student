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
  DeleteOutlined,
} from "@ant-design/icons";
import { showErrorToast, showSuccessToast } from "../../utils/toaster";
import type { studentType } from "../../services/studentService";
const apiUrl = import.meta.env.VITE_API_URL;

const { Title } = Typography;

interface ActivityData {
  id: number;
  category: string;
  skill: string;
  description: string;
  achievement: string;
  certificate?: UploadFile;
}

interface ChildProps {
  open: boolean;
  handleClose: () => void;
  handleOpen: () => void;
  student: studentType;
  fetchUser: () => void;
}

const ExtraCurricularActivityDrawer: React.FC<ChildProps> = ({
  open,
  handleClose,
  student,
  fetchUser,
}) => {
  const [formList, setFormList] = useState<ActivityData[]>([
    {
      category: "",
      skill: "",
      description: "",
      achievement: "",
      certificate: undefined,
      id: 0,
    },
  ]);

  const handleDeleteActivity = (index: number) => {
    setFormList((prev) => prev.filter((_, i) => i !== index));
  };

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

  const handleAddActivity = () => {
    setFormList([
      ...formList,
      {
        category: "",
        skill: "",
        description: "",
        achievement: "",
        certificate: undefined,
        id: 0,
      },
    ]);
  };

  const handleChange = (
    index: number,
    key: keyof ActivityData,
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
        !proj.category || !proj.skill || !proj.description || !proj.achievement
    );
    if (hasEmptyFields) {
      showErrorToast("Please fill in all fields for every activity.");
      return;
    }

    const activityFormData = new FormData();
    let activityFileIndex = 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const activityDatas = formList.map((activity: any) => {
      let activityFilePath = null;
      let activityFileFlag = null;
      let fileIndex = null;

      if (activity.certificate) {
        activityFormData.append("files", activity.certificate);
        activityFilePath = activity?.certificate?.response?.path
          ? activity.certificate.response.path.replace(/\\\\/g, "\\")
          : "";
        activityFileFlag = activity?.certificate?.response?.filename
          ? activity.certificate.response.filename
          : "";
        fileIndex = activityFileIndex++;
      } else if (activity.activityFile?.activityPath) {
        activityFilePath = activity.activityFile.activityPath;
        activityFileFlag = activity.activityFile.activityPath;
      }

      return {
        category: activity.category,
        skill: activity.skill,
        description: activity.description || null,
        achievement: activity.achievement || null,
        student_id: student.id,
        activityFile: activityFileFlag,
        activityFilePath,
        fileIndex,
        id: activity.id,
      };
    });

    activityFormData.append("activityDatas", JSON.stringify(activityDatas));
    activityFormData.append("student_id", student.id.toString());

 
    fetchUser();
    showSuccessToast("All activities submitted successfully!");
    handleClose();
  };

  const handleCancel = () => {
    setFormList([
      {
        category: "",
        skill: "",
        description: "",
        achievement: "",

        certificate: undefined,
        id: 0,
      },
    ]);
    handleClose();
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
              Extracurricular Activities
            </Title>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={handleAddActivity}
            ></Button>
          </Space>
        }
        placement="right"
        width={550}
        onClose={handleCancel}
        open={open}
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
        {formList.map((activity, index) => (
          <Form layout="vertical" key={index}>
            <Space
              style={{ display: "flex", justifyContent: "space-between" }}
              align="center"
            >
              <Title level={5}>Activity {index + 1}</Title>
              <Button
                type="text"
                icon={<DeleteOutlined style={{ color: "red" }} />}
                onClick={() => handleDeleteActivity(index)}
                danger
              />
            </Space>
            <Form.Item label="Category" required>
              <Input
                value={activity.category}
                onChange={(e) =>
                  handleChange(index, "category", e.target.value)
                }
              />
            </Form.Item>

            <Form.Item label="Skill/Specialization" required>
              <Input
                value={activity.skill}
                onChange={(e) => handleChange(index, "skill", e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Description" required>
              <Input.TextArea
                rows={2}
                value={activity.description}
                onChange={(e) =>
                  handleChange(index, "description", e.target.value)
                }
              />
            </Form.Item>

            <Form.Item label="Achievement" required>
              <Input
                value={activity.achievement}
                onChange={(e) =>
                  handleChange(index, "achievement", e.target.value)
                }
              />
            </Form.Item>

            <Form.Item label="Add Certificate/Photos">
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
              {activity.certificate && (
                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {activity.certificate.type === "application/pdf" ? (
                    <FilePdfOutlined
                      style={{ fontSize: 24, color: "#d32029" }}
                    />
                  ) : (
                    <FileImageOutlined
                      style={{ fontSize: 24, color: "#1890ff" }}
                    />
                  )}
                  <span style={{ flex: 1 }}>{activity.certificate.name}</span>
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => {
                      handleView(activity);
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

export default ExtraCurricularActivityDrawer;
