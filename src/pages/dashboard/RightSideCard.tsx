import React, { useState } from "react";
import { Button, Card, Progress, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ProjectDrawer from "./ProjectDrawer";
// import DocumentDrawer from "./DocumentDrawer";

const RightSideCards: React.FC = () => {
  // const [open, setOpen] = useState(false);

  // const handleClose = () => {setOpen(false)};
  // const handleOpen = () => {setOpen(true)};

    const [openProject, setOpenProject] = useState(false);

  const handleProjectClose = () => {setOpenProject(false)};
  const handleProjectOpen = () => {setOpenProject(true)};

  const documents = [
    { name: "Resume", action: "View" },
    { name: "Marksheets", action: "View" },
    { name: "Professional Certifications", action: "Upload" },
  ];

  const projects = [
    {
      name: "Kofleetz",
      description: "Software Innovation Suite",
      action: "More",
      image: "",
    },
    {
      name: "RDD",
      description: "Fitout Management",
      action: "More",
      image: "",
    },
    {
      name: "Smart Coupon",
      description: "Coupon Management",
      action: "More",
      image: "",
    },
  ];

  const events = [
    {
      type: "Placement",
      title: "TCS Campus Recruitment",
      date: "21-03-2025",
      time: "11:30 AM",
    },
    {
      type: "Seminar",
      title: "Agentic AI",
      date: "24-03-2025",
      time: "10:00 AM",
    },
    {
      type: "Symposium",
      title: "Digital India Symposium 2025",
      date: "24-03-2025",
      time: "10:00 AM",
    },
  ];

  return (
    <>
      <Card
        bordered={false}
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
            <Button shape="circle" icon={<PlusOutlined />} onClick={()=>{
              // handleOpen();
            }}/>
          </div>
        }
        bordered={false}
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
            <Button shape="circle" icon={<PlusOutlined />} onClick={handleProjectOpen} />
          </div>
        }
        className="mt-3"
      >
        {projects.map((project, index) => (
          <div
            key={index}
            className="d-flex justify-content-between align-items-center border-bottom py-2"
          >
            <Typography.Text>{project.name}</Typography.Text>
            <Typography.Text type="secondary">
              {project.description}
            </Typography.Text>
            <Button type="primary" shape="round">
              {project.action}
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
        bordered={false}
        className="mt-3"
      >
        {events.map((event, index) => (
          <div
            key={index}
            className="d-flex justify-content-between align-items-center border-bottom py-2"
          >
            <div>
              <Typography.Text type="secondary">{event.type}</Typography.Text>
              <Typography.Title level={5}>{event.title}</Typography.Title>
              <Typography.Text type="warning">
                {event.date} {event.time}
              </Typography.Text>
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
      {/* <DocumentDrawer open={open} handleClose={handleClose} handleOpen={handleOpen}/> */}

      <ProjectDrawer  openProject={openProject} handleProjectClose={handleProjectClose} handleProjectOpen={handleProjectOpen} />
    </>
  );
};

export default RightSideCards;
