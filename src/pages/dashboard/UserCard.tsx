import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Image,
  Tooltip,
  Skeleton,
  Flex,
  Divider,
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
import dayjs from "dayjs";
import ProfileDrawer from "./ProfileDrawer";

const { Title, Paragraph, Text } = Typography;

interface ChildProps {
  student: studentType;
  fetchUser: () => void;
}

const UserCard: React.FC<ChildProps> = ({ student, fetchUser }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  return (
    <>
      <Card className={styles.userCard}>
        {!student.id ? (
          <Row gutter={[24, 16]} align="middle">
            <Col xs={24} sm={8} md={6} className={styles.avatarCol}>
              <Skeleton.Avatar
                active
                size={150}
                shape="circle"
                className={styles.avatar}
              />
            </Col>
            <Col xs={24} sm={16} md={18}>
              <Skeleton.Input active className={styles.skeletonTitle} />
              <Skeleton.Input active className={styles.skeletonSubtitle} />
              <Skeleton active paragraph={{ rows: 3 }} title={false} />
              <Flex gap="small" wrap="wrap">
                <Skeleton.Button active className={styles.skeletonTag} />
                <Skeleton.Button active className={styles.skeletonTag} />
                <Skeleton.Button active className={styles.skeletonTag} />
              </Flex>
            </Col>
          </Row>
        ) : (
          <Row gutter={[24, 16]} align="middle">
            <Col xs={24} sm={8} md={6} className={styles.avatarCol}>
              <Image
                src={ProfImg}
                alt="Profile"
                preview={false}
                className={styles.avatar}
              />
            </Col>
            <Col xs={24} sm={16} md={18}>
              <Flex justify="space-between" align="flex-start" wrap="wrap">
                <Flex align="center" gap="small" wrap="wrap">
                  <Title level={3} className={styles.userName}>
                    {`${student.firstname} ${student.lastname}`}
                  </Title>
                  <Image
                    src={Verified}
                    alt="verified"
                    width={20}
                    height={20}
                    preview={false}
                    className={styles.verifiedBadge}
                  />
                </Flex>

                <Tooltip title="Edit Profile">
                  <EditOutlined
                    className={styles.editIcon}
                    onClick={() => setDrawerVisible(true)}
                  />
                </Tooltip>
              </Flex>

              <Text type="secondary" className={styles.userId}>
                ID No: AHU59603
              </Text>

              {student.headline && (
                <Paragraph className={styles.userHeadline}>
                  {student.headline}
                </Paragraph>
              )}

              <Divider className={styles.divider} />

              <Flex vertical gap="small">
                <Flex align="center" gap="middle" wrap="wrap">
                  <Flex align="center" gap="small" className={styles.infoItem}>
                    <BookOutlined className={styles.infoIcon} />
                    <Text>{student.degree.name}</Text>
                  </Flex>

                  <Flex align="center" gap="small" className={styles.infoItem}>
                    <BankOutlined className={styles.infoIcon} />
                    <Text>
                      Saranathan College Of Engineering (2004 to 2008)
                    </Text>
                  </Flex>
                </Flex>

                <Flex align="center" gap="middle" wrap="wrap">
                  <Flex align="center" gap="small" className={styles.infoItem}>
                    <EnvironmentOutlined className={styles.infoIcon} />
                    <Text>Chennai</Text>
                  </Flex>

                  <Flex align="center" gap="small" className={styles.infoItem}>
                    <LinkOutlined className={styles.infoIcon} />
                    <a
                      href={student.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.websiteLink}
                    >
                      {student.website.replace(/^https?:\/\//, "")}
                    </a>
                  </Flex>

                  <Flex align="center" gap="small" className={styles.infoItem}>
                    <CalendarOutlined className={styles.infoIcon} />
                    <Text>
                      DOB {dayjs(student.dob).format("MMM D [of] YYYY")}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>

              <Divider className={styles.divider} />

              <Flex justify="start" gap="middle" wrap="wrap">
                {student.profile_github && (
                  <Image
                    src={Github}
                    alt="github"
                    width={24}
                    height={24}
                    preview={false}
                    className={styles.socialIcon}
                    onClick={() =>
                      window.open(student.profile_github, "_blank")
                    }
                  />
                )}
                {student.profile_reddit && (
                  <Image
                    src={Reddit}
                    alt="reddit"
                    width={24}
                    height={24}
                    preview={false}
                    className={styles.socialIcon}
                    onClick={() =>
                      window.open(student.profile_reddit, "_blank")
                    }
                  />
                )}
                {student.profile_linkedin && (
                  <Image
                    src={Linkedin}
                    alt="linkedin"
                    width={24}
                    height={24}
                    preview={false}
                    className={styles.socialIcon}
                    onClick={() =>
                      window.open(student.profile_linkedin, "_blank")
                    }
                  />
                )}
                {student.profile_behance && (
                  <Image
                    src={Be}
                    alt="behance"
                    width={24}
                    height={24}
                    preview={false}
                    className={styles.socialIcon}
                    onClick={() =>
                      window.open(student.profile_behance, "_blank")
                    }
                  />
                )}
              </Flex>
            </Col>
          </Row>
        )}
      </Card>

      <ProfileDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        fetchUser={fetchUser}
        student={student}
      />
    </>
  );
};

export default UserCard;
