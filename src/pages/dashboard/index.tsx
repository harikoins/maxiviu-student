import React, { useEffect } from "react";
import { Col, Row, Layout } from "antd";
import ExtracurricularActivities from "./ExtraCurricularActivities";
import RightSideCards from "./RightSideCard";
import SkillsComponent from "./SkillDatas";
import StoryCards from "./StoryCard";
import UserCard from "./UserCard";
import VideoCard from "./VideoCard";
import { getstudent, type studentType } from "../../services/studentService";
import { userSignal } from "../../signals/userSignals";

const { Content } = Layout;

const ProfileDashboard: React.FC = () => {
  const [student, setStudent] = React.useState<studentType>({} as studentType);

  const fetchUser = async () => {
    const student_id = userSignal.value?.studentid || 0;
    const response = await getstudent(student_id);
    setStudent(response);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Layout style={{ backgroundColor: "#f5f5f5", padding: "24px" }}>
      <Content>
        <Row gutter={[16, 16]}>
          <Col md={12}>
            <UserCard />
          </Col>
          <Col md={12}>
            <VideoCard />
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
          <Col md={16}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <StoryCards student={student} fetchUser={fetchUser}/>
              </Col>
              <Col span={24}>
                <SkillsComponent />
              </Col>
              <Col span={24}>
                <ExtracurricularActivities />
              </Col>
            </Row>
          </Col>
          <Col md={8}>
            <RightSideCards />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ProfileDashboard;
