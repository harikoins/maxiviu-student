import React, { useEffect } from "react";
import { Col, Row, Layout, message, notification } from "antd";
import ExtracurricularActivities from "./ExtraCurricularActivities";
import RightSideCards from "./RightSideCard";
import SkillsComponent from "./SkillDatas";
import StoryCards from "./StoryCard";
import UserCard from "./UserCard";
import VideoCard from "./VideoCard";
import { setUser, type UserType } from "../../signals/userSignals";
import { fetchUserData } from "../../services/userService";
import { useSignals } from "@preact/signals-react/runtime";

const { Content } = Layout;

const ProfileDashboard: React.FC = () => {
  useSignals();

  const fetchUser = async () => {
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
      fetchUserData(userid);

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
    fetchUser();
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
                <StoryCards onUpdate={fetchUser}/>
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
