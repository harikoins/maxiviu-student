import React, { useState } from "react";
import { Button, Card, Progress, Typography, Flex } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ProjectDrawer from "./ProjectDrawer";
import type { studentType } from "../../services/studentService";
import DocumentDrawer from "./DocumentDrawer";
import type { eventType } from "../../services/eventService";

interface ChildProps {
  student: studentType;
  fetchUser: () => void;
  events: eventType[];
}

const RightSideCards: React.FC<ChildProps> = ({
  student,
  fetchUser,
  events,
}) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const [openProject, setOpenProject] = useState(false);

  const handleProjectClose = () => {
    setOpenProject(false);
  };
  const handleProjectOpen = () => {
    setOpenProject(true);
  };

  const documents = [
    { name: "Resume", action: "View" },
    { name: "Marksheets", action: "View" },
    { name: "Professional Certifications", action: "View" },
  ];

  return (
    <>
      <Card
        className="mb-4 rounded-4 mt-3"
        title={
          <div className="d-flex justify-content-between align-items-center">
            <Typography.Title level={5}>
              Competency Completeness
            </Typography.Title>
            <a href="#" style={{ color: "#4DC4FF" }}>
              View Insights
            </a>
          </div>
        }
      >
        <Progress percent={93} status="active" />
      </Card>

      <Card
        title={
          <div className="d-flex justify-content-between align-items-center">
            <Typography.Title level={5} style={{ margin: 0 }}>
              Documents
            </Typography.Title>
            <Button
              shape="circle"
              icon={<PlusOutlined />}
              onClick={() => {
                handleOpen();
              }}
            />
          </div>
        }
        className="mt-3"
      >
        {documents.map((doc, index) => (
          <div
            key={index}
            className="d-flex justify-content-between align-items-center border-bottom py-2"
          >
            <Typography.Text>{doc.name}</Typography.Text>
            <Button type="primary" shape="round">
              {doc.action}
            </Button>
          </div>
        ))}
      </Card>

      <Card
        title={
          <div className="d-flex justify-content-between align-items-center">
            <Typography.Title level={5} style={{ margin: 0 }}>
              Projects & Innovations
            </Typography.Title>
            <Button
              shape="circle"
              icon={<PlusOutlined />}
              onClick={handleProjectOpen}
            />
          </div>
        }
        className="mt-3"
      >
        {student?.projects?.map((project, index) => (
          <div
            key={index}
            className="d-flex justify-content-between align-items-center border-bottom py-2"
          >
            <Typography.Text>{project?.name}</Typography.Text>
            <Typography.Text type="secondary">
              {project?.techskill}
            </Typography.Text>
            <Button
              type="primary"
              shape="round"
              onClick={() => {
                handleProjectOpen();
              }}
            >
              More
            </Button>
          </div>
        ))}
        <Typography.Link style={{ color: "#4DC4FF" }}>
          Show more
        </Typography.Link>
      </Card>

      <Card
        title={
          <Typography.Title level={5} style={{ margin: 0 }}>
            Events/Campus
          </Typography.Title>
        }
        className="mt-3"
      >
        {events.slice(0,3).map((event, index) => (
          <div
            key={index}
            className="d-flex justify-content-between align-items-center border-bottom py-2"
          >
            <div>
              <Typography.Title level={5}>{event.name}</Typography.Title>
              <Flex vertical>
                <Typography.Text type="warning">
                  Start at :{" "}
                  {new Date(event.start_datetime).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </Typography.Text>
                <Typography.Text type="warning">
                  End at :{" "}
                  {new Date(event.end_datetime).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </Typography.Text>
              </Flex>
            </div>
            <Button type="primary" shape="round">
              View
            </Button>
          </div>
        ))}
        <Typography.Link style={{ color: "#4DC4FF" }}>
          Show more
        </Typography.Link>
      </Card>
      <DocumentDrawer
        open={open}
        handleClose={handleClose}
        handleOpen={handleOpen}
        student={student}
      />

      <ProjectDrawer
        openProject={openProject}
        handleProjectClose={handleProjectClose}
        handleProjectOpen={handleProjectOpen}
        student={student}
        fetchUser={fetchUser}
      />
    </>
  );
};

export default RightSideCards;
