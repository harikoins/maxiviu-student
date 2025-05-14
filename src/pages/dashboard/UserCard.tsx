import React from "react";
import { Card, Row, Col, Typography, Image, Space, Tooltip } from "antd";
import { EditOutlined, EnvironmentOutlined, LinkOutlined, CalendarOutlined, BankOutlined, BookOutlined } from "@ant-design/icons";
import ProfImg from "../../assets/Dashboard/profile.jpg";
import Github from "../../assets/Dashboard/github.png";
import Reddit from "../../assets/Dashboard/reddit.png";
import Be from "../../assets/Dashboard/social.png";
import Linkedin from "../../assets/Dashboard/linkedin.png";
import Verified from "../../assets/Dashboard/verified.svg";
import styles from "../../components/styles/Dashboard.module.css";

const { Title, Paragraph } = Typography;

const UserCard: React.FC = () => {
  return (
    <Card bordered={false} className="rounded-4 pb-4 mb-4">
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
                  Muthu Kumar
                </Title>
                <Image
                  src={Verified}
                  alt="verified"
                  width={25}
                  height={25}
                  preview={false}
                />
                <Tooltip title="Edit">
                  <EditOutlined className={styles["edit-pen-icon"]} style={{ fontSize: "1.25rem" }} />
                </Tooltip>
              </Space>
            }
            description={
              <>
                <Paragraph className={styles["card-idno"]}>ID No: AHU59603</Paragraph>
                <Paragraph className={styles["card-paratext"]} style={{ marginBottom: "10px" }}>
                  Python, Java, Machine Learning, AWS Certified Developer
                </Paragraph>
                <Paragraph className={styles["card-paratext"]}>
                  <BookOutlined /> B.Tech (Information Technology)
                </Paragraph>
                <Paragraph className={styles["card-paratext"]}>
                  <BankOutlined /> Saranathan College Of Engineering (2004 to 2008)
                </Paragraph>
                <Space size="small" wrap className="mt-2">
                  <Paragraph className={styles["card-paratext"]}>
                    <EnvironmentOutlined /> Chennai
                  </Paragraph>
                  <Paragraph className={styles["card-paratext"]}>
                    <LinkOutlined />
                    <a href="#" style={{ textDecoration: "none", marginLeft: "5px" }}>
                      profilelink.com
                    </a>
                  </Paragraph>
                  <Paragraph className={styles["card-paratext"]}>
                    <CalendarOutlined /> DOB May 8 of 2012
                  </Paragraph>
                </Space>
                <Space size="middle" className="mt-2">
                  <Image src={Github} alt="github" width={30} height={30} preview={false} />
                  <Image src={Reddit} alt="reddit" width={30} height={30} preview={false} />
                  <Image src={Linkedin} alt="linkedin" width={30} height={30} preview={false} />
                  <Image src={Be} alt="be" width={30} height={30} preview={false} />
                </Space>
              </>
            }
          />
        </Col>
      </Row>
    </Card>
  );
};

export default UserCard;
