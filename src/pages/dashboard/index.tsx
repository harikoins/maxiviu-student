import React from "react";
import { Col, Row, Layout } from "antd";
import ExtracurricularActivities from "./ExtraCurricularActivities";
import RightSideCards from "./RightSideCard";
import SkillsComponent from "./SkillDatas";
import StoryCards from "./StoryCard";
import UserCard from "./UserCard";
import VideoCard from "./VideoCard";
import "bootstrap/dist/css/bootstrap.min.css";

const { Content } = Layout;

const ProfileDashboard: React.FC = () => {
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
                <StoryCards />
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
