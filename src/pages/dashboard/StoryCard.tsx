import React from "react";
import { Card, Typography, Space, Col, Row } from "antd";
import {
  EditOutlined,
  TrophyOutlined,
  EyeOutlined,
  BookOutlined,
} from "@ant-design/icons";
import styles from "../../components/styles/Dashboard.module.css";

const { Title, Text } = Typography;

const achievements = [
  "Problem-Solving",
  "Strategic Thinking",
  "Tech Integration",
  "Continuous Improvement",
  "Collaborative Innovation",
];

const StoryCards: React.FC = () => {
  return (
    <>
      {/* My Story Card */}
      <Row gutter={[16, 16]}>
        <Col span={8} >
          <Card className="rounded-4 mt-3">
            <Card.Meta
              title={
                <div className="d-flex align-items-center gap-2 justify-content-between">
                  <Space>
                    <BookOutlined style={{ color: "#3393FF" }} />
                    <Title level={4} style={{ margin: 0 }}>
                      My Story
                    </Title>
                  </Space>
                  <EditOutlined
                    className={styles["edit-pen-icon"]}
                    style={{ fontSize: "1.25rem" }}
                  />
                </div>
              }
              description={
                <Text className={styles["card-inside-text"]}>
                  Aspiring software engineer with a passion for AI and machine
                  learning. Committed to solving real-world problems through
                  technology.
                </Text>
              }
            />
          </Card>
        </Col>

        {/* My Goals Card */}
        <Col span={8}>
          <Card className="rounded-4 mt-3">
            <Card.Meta
              title={
                <div className="d-flex align-items-center gap-2 justify-content-between">
                  <Space>
                    <EyeOutlined style={{ color: "#3393FF" }} />
                    <Title level={4} style={{ margin: 0 }}>
                      My Goals
                    </Title>
                  </Space>
                  <EditOutlined
                    className={styles["edit-pen-icon"]}
                    style={{ fontSize: "1.25rem" }}
                  />
                </div>
              }
              description={
                <Text className={styles["card-inside-text"]}>
                  Data Scientist, Full-Stack Developer, AI Developer, Database
                  Developer, AI/ML Web Application Developer, Data Engineer,
                  Back-End Developer, NLP Engineer.
                </Text>
              }
            />
          </Card>
        </Col>

        {/* My Achievements Card */}
        <Col span={8}>
          <Card
            className="rounded-4 mt-3"
        
          >
            <Card.Meta
              title={
                <div className="d-flex align-items-center gap-2 justify-content-between">
                  <Space>
                    <TrophyOutlined style={{ color: "#3393FF" }} />
                    <Title level={4} style={{ margin: 0 }}>
                      My Achievements
                    </Title>
                  </Space>
                  <EditOutlined
                    className={styles["edit-pen-icon"]}
                    style={{ fontSize: "1.25rem" }}
                  />
                </div>
              }
              description={
                <ul className="list-unstyled" style={{ paddingLeft: 20 }}>
                  {achievements.map((item) => (
                    <li key={item} className="d-flex align-items-center gap-2">
                      {item}
                    </li>
                  ))}
                </ul>
              }
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default StoryCards;
