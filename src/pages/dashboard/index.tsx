import React, { useEffect, useState } from "react";
import { Col, Row, Layout, message, notification } from "antd";
import ExtracurricularActivities from "./ExtraCurricularActivities";
import RightSideCards from "./RightSideCard";
import SkillsComponent from "./SkillDatas";
import StoryCards from "./StoryCard";
import UserCard from "./UserCard";
import VideoCard from "./VideoCard";
import { setUser, type UserType } from "../../signals/userSignals";
import { getstudent } from "../../services/studentService";
import type { studentType } from "../../services/studentService";
import "bootstrap/dist/css/bootstrap.min.css";

const { Content } = Layout;

const ProfileDashboard: React.FC = () => {
  const [userDatas, setUserDatas] = useState<studentType | null>(null);

  const fetchUserData = async () => {
    try {
      // Safely retrieve and parse the user data from local storage
      const storedUser = localStorage.getItem("komaxiviustudent");
      if (!storedUser) {
        notification.error({
          message: "Error",
          description: "User not found in local storage.",
        });
      }

      const parsedUser = JSON.parse(storedUser ?? "{}");

      if (!parsedUser?.studentid) {
        notification.error({
          message: "Error",
          description: "Invalid user ID.",
        });
        return;
      }

      const userid: number = parsedUser.studentid;

      if (!userid) {
        throw new Error("Invalid user ID.");
      }

      // Fetch user data using the API
      const response = await getstudent(userid);

      console.log(response, "response");

      if (response && response.items) {
        setUserDatas(response.items);
      } else {
        notification.error({
          message: "Fetch Error",
          description: "User data not found.",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      notification.error({
        message: "Fetch Error",
        description: error?.message || "Failed to fetch user data.",
      });
    }
  };

  // Automatically fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const username = params.get("username");
    const email = params.get("email");
    const id = Number(params.get("id"));
    const studentid = Number(params.get("studentid"));

    if (token && username && email && id) {
      const loginuser: UserType = {
        username,
        email,
        accessToken: token,
        id,
        studentid,
      };

      setUser(loginuser);
      localStorage.setItem("maxiviu_student", JSON.stringify(loginuser));

      message.success("Logged in with Google!");
    }
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
