// import React, { useState } from "react";
// import { Tabs, Table, Button, Space } from "antd";
// import { PlusCircleOutlined } from "@ant-design/icons";
// import type { studentType } from "../../services/studentService";
// import SkillsDrawer from "./SkillsDrawer";

// interface CertificationData {
//   name: string;
//   mode: string;
//   by: string;
// }



// const certificationData: CertificationData[] = [
//   {
//     name: "AWS Certified Developer - Associate",
//     mode: "Online Proctored Exam",
//     by: "AWS",
//   },
//   {
//     name: "Professional React Developer",
//     mode: "Online Course with Assessment",
//     by: "Meta (Coursera)",
//   },
//   {
//     name: "Google Cloud Associate Engineer",
//     mode: "Remote Proctored Exam",
//     by: "Google Cloud",
//   },
// ];

// interface ChildProps {
//   student: studentType;
//   fetchUser: () => void;
// }

// const SkillsComponent: React.FC<ChildProps> = ({ student, fetchUser }) => {
//   const [activeKey, setActiveKey] = useState<string>("technical");
//   const [open, setOpen] = useState(false);

//   const handleClose = () => {
//     setOpen(false);
//   };
//   const handleOpen = () => {
//     setOpen(true);
//   };

//   const columnsTechnical = [
//     { title: "Skill", dataIndex: "skill", key: "skill" },
//     { title: "Level", dataIndex: "expertiselevel", key: "expertiselevel" },
//     {
//       title: "Status",
//       dataIndex: "evaluationstatus",
//       key: "evaluationstatus",
//       render: (text: string,) => (
//         <span style={{}}>{text}</span>
//       ),
//     },
//     { title: "Projects", dataIndex: "noofprojects", key: "noofprojects" },
//     { title: "Mock Interview", dataIndex: "mockinterview", key: "mockinterview" },
//     { title: "Best Score", dataIndex: "bestscore", key: "bestscore" },
//   ];

//   const columnsSoft = [
//     { title: "Skill", dataIndex: "skill", key: "skill" },
//     { title: "Training Attended", dataIndex: "trainingattended", key: "trainingattended" },
//     {
//       title: "Status",
//       dataIndex: "evaluationstatus",
//       key: "evaluationstatus",
//       render: (text: string) => (
//         <span style={{}}>{text}</span>
//       ),
//     },
//     { title: "Mock Interview", dataIndex: "mockinterview", key: "mockinterview" },
//     { title: "Best Score", dataIndex: "bestscore", key: "bestscore" },
//   ];

//   const columnsCertification = [
//     { title: "Certificate Name", dataIndex: "name", key: "name" },
//     { title: "Mode", dataIndex: "mode", key: "mode" },
//     { title: "Certified By", dataIndex: "by", key: "by" },
//   ];

//   const columnsInternship = [
//     { title: "Role", dataIndex: "role", key: "role" },
//     { title: "Type", dataIndex: "type", key: "type" },
//     { title: "Organization", dataIndex: "organization", key: "organization" },
//     { title: "Duration (months)", dataIndex: "duration", key: "duration" },
//     { title: "Status", dataIndex: "status", key: "status" },
//   ];

//   return (
//     <>
//       <div className="p-3 bg-light rounded-3">
//         <h5>Skills</h5>
//         <Space className="mb-3 d-flex justify-content-between">
//           {["python", "html5", "js", "database", "cpp", "java", "github"].map(
//             (icon, index) => (
//               <img
//                 key={index}
//                 src={`/${icon}.png`}
//                 alt={icon}
//                 width={50}
//                 height={50}
//                 style={{ objectFit: "cover", objectPosition: "center" }}
//               />
//             )
//           )}
//           <Button
//             icon={<PlusCircleOutlined />}
//             type="primary"
//             style={{ marginLeft: "auto", fontWeight: "bold" }}
//             onClick={handleOpen}
//           >
//             Add More
//           </Button>
//         </Space>
//         <Tabs activeKey={activeKey} onChange={setActiveKey} type="card">
//           <Tabs.TabPane tab="Technical Skills" key="technical">
//             <Table
//               columns={columnsTechnical}
//               dataSource={student?.technicalskills}
//               rowKey="skill"
//               pagination={false}
//             />
//           </Tabs.TabPane>
//           <Tabs.TabPane tab="Soft Skills" key="soft">
//             <Table
//               columns={columnsSoft}
//               dataSource={student?.softskills}
//               rowKey="skill"
//               pagination={false}
//             />
//           </Tabs.TabPane>
//           <Tabs.TabPane tab="Certifications" key="certifications">
//             <Table
//               columns={columnsCertification}
//               dataSource={certificationData}
//               rowKey="name"
//               pagination={false}
//             />
//           </Tabs.TabPane>
//           <Tabs.TabPane tab="Internships" key="internships">
//             <Table
//               columns={columnsInternship}
//               dataSource={student?.internships}
//               rowKey="role"
//               pagination={false}
//             />
//           </Tabs.TabPane>
//         </Tabs>
//       </div>
//       <SkillsDrawer
//         open={open}
//         handleClose={handleClose}
//         handleOpen={handleOpen}
//         student={student}
//         fetchUser={fetchUser}
//       />
//     </>
//   );
// };

// export default SkillsComponent;

import React, { useState } from "react";
import { Tabs, Table, Button, Space, Grid } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import type { studentType } from "../../services/studentService";
import SkillsDrawer from "./SkillsDrawer";

const { useBreakpoint } = Grid;

interface CertificationData {
  name: string;
  mode: string;
  by: string;
}

const certificationData: CertificationData[] = [
  {
    name: "AWS Certified Developer - Associate",
    mode: "Online Proctored Exam",
    by: "AWS",
  },
  {
    name: "Professional React Developer",
    mode: "Online Course with Assessment",
    by: "Meta (Coursera)",
  },
  {
    name: "Google Cloud Associate Engineer",
    mode: "Remote Proctored Exam",
    by: "Google Cloud",
  },
];

interface ChildProps {
  student: studentType;
  fetchUser: () => void;
}

const SkillsComponent: React.FC<ChildProps> = ({ student, fetchUser }) => {
  const [activeKey, setActiveKey] = useState<string>("technical");
  const [open, setOpen] = useState(false);
  const screens = useBreakpoint();

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const renderSkillIcons = () => {
    const icons = ["python", "html5", "js", "database", "cpp", "java", "github"];
    const size = screens.xs ? 30 : screens.sm ? 40 : 50;
    
    return (
      <Space 
        size={screens.xs ? 'small' : 'middle'} 
        wrap 
        style={{ flexGrow: 1, justifyContent: screens.md ? 'flex-start' : 'center' }}
      >
        {icons.map((icon, index) => (
          <img
            key={index}
            src={`/${icon}.png`}
            alt={icon}
            width={size}
            height={size}
            style={{ objectFit: "contain" }}
          />
        ))}
      </Space>
    );
  };

  const columnsTechnical = [
    { 
      title: "Skill", 
      dataIndex: "skill", 
      key: "skill",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      responsive: ['md'] as any,
    },
    { 
      title: "Level", 
      dataIndex: "expertiselevel", 
      key: "expertiselevel",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      responsive: ['md'] as any,
    },
    {
      title: "Status",
      dataIndex: "evaluationstatus",
      key: "evaluationstatus",
      render: (text: string) => (
        <span style={{ color: text === 'Verified' ? '#52c41a' : '#faad14' }}>{text}</span>
      ),
    },
    { 
      title: "Projects", 
      dataIndex: "noofprojects", 
      key: "noofprojects",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      responsive: ['lg'] as any,
    },
    { 
      title: "Mock Interview", 
      dataIndex: "mockinterview", 
      key: "mockinterview",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      responsive: ['lg'] as any,
    },
    { 
      title: "Best Score", 
      dataIndex: "bestscore", 
      key: "bestscore",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      responsive: ['xl'] as any,
    },
  ];

  const columnsSoft = [
    { 
      title: "Skill", 
      dataIndex: "skill", 
      key: "skill",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      responsive: ['md'] as any,
    },
    { 
      title: "Training Attended", 
      dataIndex: "trainingattended", 
      key: "trainingattended",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      responsive: ['lg'] as any,
    },
    {
      title: "Status",
      dataIndex: "evaluationstatus",
      key: "evaluationstatus",
      render: (text: string) => (
        <span style={{ color: text === 'Verified' ? '#52c41a' : '#faad14' }}>{text}</span>
      ),
    },
    { 
      title: "Mock Interview", 
      dataIndex: "mockinterview", 
      key: "mockinterview",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      responsive: ['lg'] as any,
    },
    { 
      title: "Best Score", 
      dataIndex: "bestscore", 
      key: "bestscore",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      responsive: ['xl'] as any,
    },
  ];

  const columnsCertification = [
    { 
      title: "Certificate Name", 
      dataIndex: "name", 
      key: "name",
      ellipsis: true,
    },
    { 
      title: "Mode", 
      dataIndex: "mode", 
      key: "mode",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      responsive: ['md'] as any,
    },
    { 
      title: "Certified By", 
      dataIndex: "by", 
      key: "by",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      responsive: ['sm'] as any,
    },
  ];

  const columnsInternship = [
    { 
      title: "Role", 
      dataIndex: "role", 
      key: "role",
      ellipsis: true,
    },
    { 
      title: "Type", 
      dataIndex: "type", 
      key: "type",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      responsive: ['md'] as any,
    },
    { 
      title: "Organization", 
      dataIndex: "organization", 
      key: "organization",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      responsive: ['sm'] as any,
    },
    { 
      title: "Duration", 
      dataIndex: "duration", 
      key: "duration",
      render: (text: string) => `${text} months`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      responsive: ['lg'] as any,
    },
    { 
      title: "Status", 
      dataIndex: "status", 
      key: "status",
      render: (text: string) => (
        <span style={{ color: text === 'Completed' ? '#52c41a' : '#1890ff' }}>{text}</span>
      ),
    },
  ];

  return (
    <div className="p-2 p-md-3 bg-light rounded-3">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3">
        <h5 className="mb-2 mb-md-0">Skills</h5>
        <div className="d-flex align-items-center w-100 w-md-auto">
          {renderSkillIcons()}
          <Button
            icon={<PlusCircleOutlined />}
            type="primary"
            className="ms-2"
            style={{ fontWeight: "bold", whiteSpace: 'nowrap' }}
            onClick={handleOpen}
            size={screens.xs ? 'small' : 'middle'}
          >
            {screens.xs ? 'Add' : 'Add More'}
          </Button>
        </div>
      </div>
      
      <Tabs 
        activeKey={activeKey} 
        onChange={setActiveKey} 
        type={screens.xs ? "line" : "card"}
        tabPosition={screens.xs ? "top" : "top"}
        centered
        className="skills-tabs"
      >
        <Tabs.TabPane tab="Technical" key="technical">
          <Table
            columns={columnsTechnical}
            dataSource={student?.technicalskills}
            rowKey="skill"
            pagination={false}
            scroll={{ x: true }}
            size={screens.xs ? 'small' : 'middle'}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Soft Skills" key="soft">
          <Table
            columns={columnsSoft}
            dataSource={student?.softskills}
            rowKey="skill"
            pagination={false}
            scroll={{ x: true }}
            size={screens.xs ? 'small' : 'middle'}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Certifications" key="certifications">
          <Table
            columns={columnsCertification}
            dataSource={certificationData}
            rowKey="name"
            pagination={false}
            scroll={{ x: true }}
            size={screens.xs ? 'small' : 'middle'}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Internships" key="internships">
          <Table
            columns={columnsInternship}
            dataSource={student?.internships}
            rowKey="role"
            pagination={false}
            scroll={{ x: true }}
            size={screens.xs ? 'small' : 'middle'}
          />
        </Tabs.TabPane>
      </Tabs>
      
      <SkillsDrawer
        open={open}
        handleClose={handleClose}
        handleOpen={handleOpen}
        student={student}
        fetchUser={fetchUser}
      />
    </div>
  );
};

export default SkillsComponent;