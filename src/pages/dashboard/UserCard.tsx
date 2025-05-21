import React from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Image,
  Space,
  Tooltip,
  Skeleton,
} from "antd";
import {
  EditOutlined,
  EnvironmentOutlined,
  LinkOutlined,
  CalendarOutlined,
  BankOutlined,
  BookOutlined,
} from "@ant-design/icons";
import ProfImg from "../../assets/Dashboard/profile.jpg";
import Github from "../../assets/Dashboard/github.png";
import Reddit from "../../assets/Dashboard/reddit.png";
import Be from "../../assets/Dashboard/social.png";
import Linkedin from "../../assets/Dashboard/linkedin.png";
import Verified from "../../assets/Dashboard/verified.svg";
import styles from "../../components/styles/Dashboard.module.css";
import type { studentType } from "../../services/studentService";

const { Title, Paragraph } = Typography;

interface ChildProps {
  student: studentType;
  fetchUser: () => void;
}

const UserCard: React.FC<ChildProps> = ({ student, fetchUser }) => {
  return (
    <>
      {!student.id ? (
        <Card bordered={false} className="rounded-4 pb-4 mb-4">
          <Row gutter={16} align="middle">
            <Col xs={24} sm={8} className="d-flex justify-content-center">
              <Skeleton.Avatar
                active
                size={150}
                shape="circle"
                style={{ marginBottom: 16 }}
              />
            </Col>
            <Col xs={24} sm={16}>
              <Skeleton.Input
                active
                style={{ width: "60%", height: 32, marginBottom: 12 }}
              />
              <Skeleton.Input
                active
                style={{ width: "40%", height: 20, marginBottom: 12 }}
              />
              <Skeleton active paragraph={{ rows: 3 }} title={false} />
              <Skeleton.Button
                active
                style={{ width: "30%", height: 20, marginRight: 8 }}
              />
              <Skeleton.Button
                active
                style={{ width: "30%", height: 20, marginRight: 8 }}
              />
              <Skeleton.Button
                active
                style={{ width: "30%", height: 20, marginTop: 8 }}
              />
            </Col>
          </Row>
        </Card>
      ) : (
        <Card className="rounded-4 pb-4 mb-4">
          <Row gutter={16} align="middle">
            <Col xs={24} sm={8} className="d-flex justify-content-center">
              <Image
                src={ProfImg}
                alt="card-horizontal-image"
                preview={false}
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </Col>
            <Col xs={24} sm={16}>
              <Card.Meta
                title={
                  <Space align="center" size="small">
                    <Title level={4} style={{ marginBottom: 0 }}>
                      {`${student.firstname} ${student.lastname}`}
                    </Title>
                    <Image
                      src={Verified}
                      alt="verified"
                      width={25}
                      height={25}
                      preview={false}
                    />
                    <Tooltip title="Edit">
                      <EditOutlined
                        className={styles["edit-pen-icon"]}
                        style={{ fontSize: "1.25rem" }}
                      />
                    </Tooltip>
                  </Space>
                }
                description={
                  <>
                    <Paragraph className={styles["card-idno"]}>
                      ID No: AHU59603
                    </Paragraph>
                    <Paragraph
                      className={styles["card-paratext"]}
                      style={{ marginBottom: "10px" }}
                    >
                      {student.headline}
                    </Paragraph>
                    <Paragraph className={styles["card-paratext"]}>
                      <BookOutlined /> {student.degree.name}
                    </Paragraph>
                    <Paragraph className={styles["card-paratext"]}>
                      <BankOutlined /> Saranathan College Of Engineering (2004
                      to 2008)
                    </Paragraph>
                    <Space size="small" wrap className="mt-2">
                      <Paragraph className={styles["card-paratext"]}>
                        <EnvironmentOutlined /> Chennai
                      </Paragraph>
                      <Paragraph className={styles["card-paratext"]}>
                        <LinkOutlined />
                        <a
                          href={`${student.website}`}
                          style={{ textDecoration: "none", marginLeft: "5px" }}
                        >
                          {student.website}
                        </a>
                      </Paragraph>
                      <Paragraph className={styles["card-paratext"]}>
                        <CalendarOutlined /> DOB May 8 of 2012
                      </Paragraph>
                    </Space>
                    <Space size="middle" className="mt-2">
                      <Image
                        src={Github}
                        alt="github"
                        width={30}
                        height={30}
                        preview={false}
                       onClick={() => window.open(`${student.profile_github}`, "_blank")}
                      />
                      <Image
                        src={Reddit}
                        alt="reddit"
                        width={30}
                        height={30}
                        preview={false}
                      />
                      <Image
                        src={Linkedin}
                        alt="linkedin"
                        width={30}
                        height={30}
                        preview={false}
                      />
                      <Image
                        src={Be}
                        alt="be"
                        width={30}
                        height={30}
                        preview={false}
                      />
                    </Space>
                  </>
                }
              />
            </Col>
          </Row>
        </Card>
      )}
    </>
  );
};

export default UserCard;
