import React, { useState } from "react";
import { Tabs, Table, Button, Space } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

interface SkillData {
  skill: string;
  level: string;
  status: string;
  statusColor: string;
  projects?: number;
  score?: string;
}

interface CertificationData {
  name: string;
  mode: string;
  by: string;
}

interface InternshipData {
  role: string;
  type: string;
  organization: string;
  duration: string;
  status: string;
}

const skillsData: SkillData[] = [
  { skill: "Python", level: "Learning", status: "Yet to be Evaluated", statusColor: "blue", projects: 2 },
  { skill: "JavaScript", level: "Intermediate", status: "Done", statusColor: "green", projects: 1 },
  { skill: "Python", level: "Learning", status: "In Progress", statusColor: "orange", projects: 3 },
  { skill: "JavaScript", level: "Intermediate", status: "Not done", statusColor: "red", projects: 1 },
];

const softData: SkillData[] = [
  { skill: "Problem Solving", level: "Attended Online Workshop", status: "Yet to be Evaluated", statusColor: "blue", score: "-" },
  { skill: "Team Work", level: "Attended Online Workshop", status: "Completed", statusColor: "green", score: "90%" },
  { skill: "Design Thinking", level: "Attended Online Workshop", status: "In Progress", statusColor: "orange", score: "NA" },
];

const certificationData: CertificationData[] = [
  { name: "AWS Certified Developer - Associate", mode: "Online Proctored Exam", by: "AWS" },
  { name: "Professional React Developer", mode: "Online Course with Assessment", by: "Meta (Coursera)" },
  { name: "Google Cloud Associate Engineer", mode: "Remote Proctored Exam", by: "Google Cloud" },
];

const internData: InternshipData[] = [
  { role: "Frontend Development Intern", type: "Onsite", organization: "TechSolutions Inc.", duration: "6", status: "Completed" },
  { role: "Backend Engineering Trainee", type: "Online", organization: "DataSystems LLC", duration: "12", status: "Completed" },
  { role: "Full Stack Workshop", type: "Onsite", organization: "CodeMaster Academy", duration: "6", status: "Certified" },
];

const SkillsComponent: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>("technical");

  const columnsTechnical = [
    { title: "Skill", dataIndex: "skill", key: "skill" },
    { title: "Level", dataIndex: "level", key: "level" },
    { 
      title: "Status", 
      dataIndex: "status", 
      key: "status",
      render: (text: string, record: SkillData) => (
        <span style={{ color: record.statusColor }}>{text}</span>
      ),
    },
    { title: "Projects", dataIndex: "projects", key: "projects" },
  ];

  const columnsSoft = [
    { title: "Skill", dataIndex: "skill", key: "skill" },
    { title: "Level", dataIndex: "level", key: "level" },
    { 
      title: "Status", 
      dataIndex: "status", 
      key: "status",
      render: (text: string, record: SkillData) => (
        <span style={{ color: record.statusColor }}>{text}</span>
      ),
    },
    { title: "Score", dataIndex: "score", key: "score" },
  ];

  const columnsCertification = [
    { title: "Certificate Name", dataIndex: "name", key: "name" },
    { title: "Mode", dataIndex: "mode", key: "mode" },
    { title: "Certified By", dataIndex: "by", key: "by" },
  ];

  const columnsInternship = [
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Organization", dataIndex: "organization", key: "organization" },
    { title: "Duration (months)", dataIndex: "duration", key: "duration" },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  return (
    <div className="p-3 bg-light rounded-3">
      <h5>Skills</h5>
      <Space className="mb-3 d-flex justify-content-between">
        {["python", "html5", "js", "database", "cpp", "java", "github"].map((icon, index) => (
          <img
            key={index}
            src={`/${icon}.png`}
            alt={icon}
            width={50}
            height={50}
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        ))}
        <Button
          icon={<PlusCircleOutlined />}
          type="primary"
          style={{ marginLeft: "auto", fontWeight: "bold" }}
        >
          Add More
        </Button>
      </Space>
      <Tabs activeKey={activeKey} onChange={setActiveKey} type="card">
        <Tabs.TabPane tab="Technical Skills" key="technical">
          <Table columns={columnsTechnical} dataSource={skillsData} rowKey="skill" pagination={false} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Soft Skills" key="soft">
          <Table columns={columnsSoft} dataSource={softData} rowKey="skill" pagination={false} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Certifications" key="certifications">
          <Table columns={columnsCertification} dataSource={certificationData} rowKey="name" pagination={false} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Internships" key="internships">
          <Table columns={columnsInternship} dataSource={internData} rowKey="role" pagination={false} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default SkillsComponent;
