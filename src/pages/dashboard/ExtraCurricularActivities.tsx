import React from "react";
import { Button, Card, Space, Typography } from "antd";
import { PictureOutlined, TeamOutlined, BookOutlined, StarOutlined, SettingOutlined, TrophyOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface Activity {
  icon: React.ReactNode;
  title: string;
  description: string;
  gallery: boolean;
}

const activities: Activity[] = [
  {
    icon: <TrophyOutlined style={{ fontSize: 24, color: "#7C7D7E" }} />,
    title: "Sports",
    description: "Football, Cricket, Athletics",
    gallery: true,
  },
  {
    icon: <StarOutlined style={{ fontSize: 24, color: "#7C7D7E" }} />,
    title: "Art and Creativity",
    description: "Painting, Theatre, Piano",
    gallery: true,
  },
  {
    icon: <BookOutlined style={{ fontSize: 24, color: "#7C7D7E" }} />,
    title: "Academic & Intellectual Pursuits",
    description: "Robotics Club, Math Olympiads",
    gallery: true,
  },
  {
    icon: <SettingOutlined style={{ fontSize: 24, color: "#7C7D7E" }} />,
    title: "Technology & STEM Activities",
    description: "Hackathon, Gaming and esports",
    gallery: false,
  },
  {
    icon: <TeamOutlined style={{ fontSize: 24, color: "#7C7D7E" }} />,
    title: "Community Service & Leadership",
    description: "Volunteering, Social Awareness Campaigns",
    gallery: false,
  },
  {
    icon: <StarOutlined style={{ fontSize: 24, color: "#7C7D7E" }} />,
    title: "Hobbies & Special Interests",
    description: "Book Clubs, Photography, Cooking",
    gallery: true,
  },
];

const ExtracurricularActivities: React.FC = () => {
  return (
    <Card style={{ backgroundColor: "#F8F9FA", borderRadius: "12px", padding: "16px" }}>
      <Space style={{ justifyContent: "space-between", width: "100%" }}>
        <Title level={4}>Extracurricular Activities</Title>
        <Button type="primary" shape="round" style={{ backgroundColor: "#4DC4FF", borderColor: "#4DC4FF" }}>
          Add More
        </Button>
      </Space>
      {activities.map((activity, index) => (
        <Card key={index} style={{ margin: "8px 0", borderRadius: "8px" }} bodyStyle={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Space size="large">
            {activity.icon}
            <span style={{ fontWeight: 600 }}>{activity.title}</span>
          </Space>
          <span style={{ flexGrow: 1, margin: "0 16px", color: "#7C7D7E" }}>{activity.description}</span>
          {activity.gallery && (
            <Button type="link" icon={<PictureOutlined style={{ color: "#4DC4FF" }} />}>Gallery</Button>
          )}
        </Card>
      ))}
    </Card>
  );
};

export default ExtracurricularActivities;
