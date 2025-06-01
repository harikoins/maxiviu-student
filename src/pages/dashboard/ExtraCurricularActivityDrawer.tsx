/* eslint-disable @typescript-eslint/no-explicit-any */
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
  List,
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
import { createBulkExtracurricularActivity } from "../../services/extracurricularActivityService";
const apiUrl = import.meta.env.VITE_API_URL;

const { Title } = Typography;

interface ActivityData {
  id: number;
  category: string;
  skill: string;
  description: string;
  achievement: string;
  certificates: UploadFile[];
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
      certificates: [],
      id: 0,
    },
  ]);

  useEffect(() => {
    console.log("Drawer opened with student:", student);
    if (open) {
      if (student?.activities?.length) {
        const initialActivities = student.activities.map((activity) => ({
          id: activity.id,
          category: activity.category || "",
          skill: activity.skill || "",
          description: activity.description || "",
          achievement: activity.achievement || "",
          certificates: activity.filePath
            ? activity.filePath.split("|").map((path, index) => ({
                uid: `-${activity.id}-${index}`,
                name:
                  activity.filename?.split("|")[index] ||
                  path.split(/[\\/]/).pop() ||
                  "certificate",
                status: "done" as const,
                url: `${apiUrl}/${path
                  .replace(/\\/g, "/")
                  .replace(/^\/+/, "")}`,
                originFileObj: undefined,
                response: {
                  path: path,
                  filename: activity.filename?.split("|")[index],
                },
              }))
            : [],
        }));
        setFormList(initialActivities);
        console.log(initialActivities, "initialActivities");
      } else {
        setFormList([
          {
            category: "",
            skill: "",
            description: "",
            achievement: "",
            certificates: [],
            id: 0,
          },
        ]);
      }
    }
  }, [open, student]);

  const handleDeleteActivity = (index: number) => {
    setFormList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleView = (file: UploadFile) => {
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
        certificates: [],
        id: 0,
      },
    ]);
  };

  const handleChange = (
    index: number,
    key: keyof ActivityData,
    value: string | UploadFile[]
  ) => {
    const newList = [...formList];
    (newList[index][key] as any) = value;
    setFormList(newList);
  };

  const handleFileChange = (index: number, info: any) => {
    const newList = [...formList];
    // Filter out any files that were removed
    newList[index].certificates = info.fileList
      .filter((file: UploadFile) => {
        const isAllowedType =
          file.type === "application/pdf" ||
          file.type?.startsWith("image/") ||
          (file.originFileObj &&
            (file.originFileObj.type === "application/pdf" ||
              file.originFileObj.type?.startsWith("image/")));

        if (!isAllowedType) {
          message.error(`${file.name} is not an image or PDF file`);
          return false;
        }
        return true;
      })
      .map((file: UploadFile) => {
        if (file.originFileObj) {
          return file.originFileObj;
        }
        return file;
      });

    setFormList(newList);
  };

  const handleRemoveFile = (activityIndex: number, fileIndex: number) => {
    const newList = [...formList];
    newList[activityIndex].certificates = newList[
      activityIndex
    ].certificates.filter((_, index) => index !== fileIndex);
    setFormList(newList);
  };

  const getPathOnly = (fullUrl:string) => {
    try {
      const url = new URL(fullUrl);
      return url.pathname.substring(1);
    } catch {
      // If it's not a valid URL, return as-is
      return fullUrl;
    }
  };

  const handleSubmit = async () => {
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

    const activityDatas = formList.map((activity) => {
      const activityFilePaths: any[] = [];
      const activityFileFlags: any[] = [];
      const fileIndexes: number[] = [];

      // Handle new files being uploaded
      activity.certificates.forEach((file) => {
        if (file instanceof File || (file as any).originFileObj) {
          const fileObj =
            file instanceof File ? file : (file as any).originFileObj;
          activityFormData.append("files", fileObj);
          fileIndexes.push(activityFileIndex++);
        } else if (file.url || file.response?.path) {
          // Handle existing files from server
          // const path = file.url || file.response.path;
          const path = getPathOnly(file.url || file.response.path);
          activityFilePaths.push(path);
          activityFileFlags.push(path);
        }
      });

      return {
        category: activity.category,
        skill: activity.skill,
        description: activity.description || null,
        achievement: activity.achievement || null,
        student_id: student.id,
        activityFiles: activityFileFlags,
        activityFilePaths,
        fileIndexes,
        id: activity.id,
      };
    });

    activityFormData.append("activityDatas", JSON.stringify(activityDatas));
    activityFormData.append("student_id", student.id.toString());

    await createBulkExtracurricularActivity(activityFormData,`uploads/${student.firstname} ${student.lastname}/extracurricularactivities`);

    console.log(activityDatas, "activityDatas");
    await fetchUser();
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
        certificates: [],
        id: 0,
      },
    ]);
    handleClose();
  };

  return (
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
              onChange={(e) => handleChange(index, "category", e.target.value)}
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

          <Form.Item label="Add Certificates/Photos">
            <Upload
              multiple
              beforeUpload={(file) => {
                const isAllowedType =
                  file.type === "application/pdf" ||
                  file.type.startsWith("image/");
                if (!isAllowedType) {
                  message.error("Only images and PDF files are allowed!");
                  return Upload.LIST_IGNORE;
                }
                return false; // prevent automatic upload
              }}
              onChange={(info) => handleFileChange(index, info)}
              fileList={[]}
              showUploadList={false}
              accept=".png,.jpg,.jpeg,.gif,.bmp,.webp,.pdf"
            >
              <Button icon={<UploadOutlined />}>Upload Certificates</Button>
            </Upload>
            <List
              dataSource={activity.certificates}
              renderItem={(file, fileIndex) => (
                <List.Item
                  actions={[
                    <Button
                      type="text"
                      icon={<EyeOutlined />}
                      onClick={() => handleView(file)}
                    />,
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveFile(index, fileIndex)}
                      danger
                    />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      file.type === "application/pdf" ? (
                        <FilePdfOutlined
                          style={{ fontSize: 24, color: "#d32029" }}
                        />
                      ) : (
                        <FileImageOutlined
                          style={{ fontSize: 24, color: "#1890ff" }}
                        />
                      )
                    }
                    title={file.name}
                  />
                </List.Item>
              )}
            />
          </Form.Item>

          <div style={{ borderBottom: "1px solid #ddd", marginBottom: 16 }} />
        </Form>
      ))}
    </Drawer>
  );
};

export default ExtraCurricularActivityDrawer;
