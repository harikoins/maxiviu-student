import React, { useState } from "react";
import { Card, Typography, Space, Col, Row } from "antd";
import {
  EditOutlined,
  TrophyOutlined,
  EyeOutlined,
  BookOutlined,
} from "@ant-design/icons";
import styles from "../../components/styles/Dashboard.module.css";
import StoryCardsDrawer from "./StoryCardsDrawer";
import type { studentType } from "../../services/studentService";
const { Title, Text } = Typography;

interface ChildProps {
  student: studentType;
  fetchUser: () => void;
}

const StoryCards: React.FC<ChildProps> = ({ student, fetchUser }) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<keyof studentType>("mystory");

  const onClose = () => {
    setOpen(false);
  };

  const handleUpdateType = (value: keyof studentType) => {
    setType(value);
    setOpen(true);
  };

  return (
    <>
      {/* My Story Card */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={24} lg={18} xl={6}>
          <Card className="rounded-4 mt-3">
            <Card.Meta
              title={
                <div
                  className="d-flex align-items-center gap-2 justify-content-between"
                  onClick={() => {
                    // console.log(userData,"userData")
                  }}
                >
                  <Space>
                    <BookOutlined style={{ color: "#3393FF" }} />
                    <Title level={4} style={{ margin: 0 }}>
                      My Story
                    </Title>
                  </Space>
                  <EditOutlined
                    className={styles["edit-pen-icon"]}
                    style={{ fontSize: "1.25rem" }}
                    onClick={() => {
                      handleUpdateType("mystory");
                    }}
                  />
                </div>
              }
              description={
                <Text className={styles["card-inside-text"]}>
                  {student.mystory ?? "Not added yet"}
                </Text>
              }
            />
          </Card>
        </Col>

        {/* My Goals Card */}
        <Col xs={24} sm={12} md={24} lg={18} xl={8}>
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
                    onClick={() => {
                      handleUpdateType("mygoal");
                    }}
                  />
                </div>
              }
              description={
                <Text className={styles["card-inside-text"]}>
                  {student.mygoal ?? "Not added yet"}
                </Text>
              }
            />
          </Card>
        </Col>

        {/* My Achievements Card */}
        <Col xs={24} sm={12} md={24} lg={18} xl={10}>
          <Card className="rounded-4 mt-3">
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
                    onClick={() => {
                      handleUpdateType("myachievement");
                    }}
                  />
                </div>
              }
              description={
                <Text className={styles["card-inside-text"]}>
                  {student.myachievement ?? "Not added yet"}
                </Text>
              }
            />
          </Card>
        </Col>
      </Row>
      <StoryCardsDrawer
        open={open}
        onClose={onClose}
        student={student}
        type={type}
        fetchUser={fetchUser}
      />
    </>
  );
};

export default StoryCards;
