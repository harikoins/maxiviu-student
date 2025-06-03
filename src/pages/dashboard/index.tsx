import React, { useEffect, useState } from "react";
import { Col, Row, Layout } from "antd";
import ExtracurricularActivities from "./ExtraCurricularActivities";
import RightSideCards from "./RightSideCard";
import SkillsComponent from "./SkillDatas";
import StoryCards from "./StoryCard";
import UserCard from "./UserCard";
import VideoCard from "./VideoCard";
import { getstudent, type studentType } from "../../services/studentService";
import { getEvents, type eventType } from "../../services/eventService";
import { userSignal } from "../../signals/userSignals";
import { useOutletContext } from 'react-router-dom';

const { Content } = Layout;

type ContextType = (data: studentType) => void;

const ProfileDashboard: React.FC = () => {
  const setStudentData = useOutletContext<ContextType>();

  const [student, setStudent] = useState<studentType>({} as studentType);
  const [events, setEvents] = useState<eventType[]>([]);

  const fetchUser = async () => {
    const student_id = userSignal.value?.studentid || 0;
    const response = await getstudent(student_id);
    if (response.id) {
      const eventDatas = await getEvents(
        response?.id,
        response?.college_id,
        response?.department_id
      );
      setEvents(eventDatas?.items ?? []);
    }

    setStudent(response);
    setStudentData(response);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Layout style={{ backgroundColor: "#f5f5f5" }}>
      <Content>
        <Row gutter={[16, 16]}>
          <Col md={12}>
            <UserCard student={student} fetchUser={fetchUser} />
          </Col>
          <Col md={12} sm={24}>
            <VideoCard />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col md={16}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <StoryCards student={student} fetchUser={fetchUser} />
              </Col>
              <Col span={24}>
                <SkillsComponent student={student} fetchUser={fetchUser} />
              </Col>
              <Col span={24}>
                <ExtracurricularActivities
                  student={student}
                  fetchUser={fetchUser}
                />
              </Col>
            </Row>
          </Col>
          <Col md={8}>
            <RightSideCards
              student={student}
              fetchUser={fetchUser}
              events={events}
            />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ProfileDashboard;
