import React from "react";
import { Button, Card, Space, Typography, Grid } from "antd";
import { 
  PictureOutlined, 
  TeamOutlined, 
  BookOutlined, 
  StarOutlined, 
  SettingOutlined, 
  TrophyOutlined 
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

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
  const screens = useBreakpoint();
  
  return (
    <Card 
      style={{ 
        backgroundColor: "#F8F9FA", 
        borderRadius: "12px", 
        padding: screens.xs ? "12px" : "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
      }}
    >
      <div style={{ 
        display: "flex", 
        flexDirection: screens.xs ? "column" : "row",
        justifyContent: "space-between", 
        alignItems: screens.xs ? "flex-start" : "center",
        marginBottom: "16px",
        gap: screens.xs ? "12px" : 0
      }}>
        <Title 
          level={4} 
          style={{ 
            margin: 0,
            fontSize: screens.xs ? "18px" : "20px"
          }}
        >
          Extracurricular Activities
        </Title>
        <Button 
          type="primary" 
          shape="round" 
          style={{ 
            backgroundColor: "#4DC4FF", 
            borderColor: "#4DC4FF",
            fontSize: screens.xs ? "12px" : "14px",
            height: screens.xs ? "32px" : "auto"
          }}
        >
          Add More
        </Button>
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {activities.map((activity, index) => (
          <Card 
            key={index} 
            style={{ 
              margin: 0,
              borderRadius: "8px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
            }} 
            bodyStyle={{ 
              padding: screens.xs ? "12px" : "16px",
              display: "flex", 
              flexDirection: screens.xs ? "column" : "row",
              alignItems: screens.xs ? "flex-start" : "center",
              gap: screens.xs ? "8px" : "16px"
            }}
          >
            <Space 
              size="middle" 
              style={{ 
                minWidth: screens.xs ? "100%" : "160px",
                justifyContent: screens.xs ? "space-between" : "flex-start"
              }}
            >
              {activity.icon}
              <Text strong style={{ fontSize: screens.xs ? "14px" : "16px" }}>
                {activity.title}
              </Text>
            </Space>
            
            <Text 
              style={{ 
                color: "#7C7D7E",
                flexGrow: 1,
                fontSize: screens.xs ? "13px" : "14px",
                margin: screens.xs ? "0 0 8px 0" : "0 16px"
              }}
            >
              {activity.description}
            </Text>
            
            {activity.gallery && (
              <Button 
                type="link" 
                icon={<PictureOutlined style={{ color: "#4DC4FF" }} />}
                style={{
                  padding: 0,
                  height: "auto",
                  whiteSpace: "nowrap",
                  fontSize: screens.xs ? "13px" : "14px"
                }}
              >
                {screens.xs ? "View" : "Gallery"}
              </Button>
            )}
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default ExtracurricularActivities;
