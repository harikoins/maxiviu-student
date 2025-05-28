import React, { useState } from "react";
import { Button, Card, Typography, Grid, Empty } from "antd";
import { PictureOutlined } from "@ant-design/icons";
import ExtraCurricularActivityDrawer from "./ExtraCurricularActivityDrawer";
import type { studentType } from "../../services/studentService";
import GalleryDrawer from "./Gallery";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

interface GalleryData {
  category: string;
  skill: string;
  achievement: string;
  description: string;
  filename: string;
  filePath: string;
}

interface ChildProps {
  student: studentType;
  fetchUser: () => void;
}

const ExtracurricularActivities: React.FC<ChildProps> = ({
  student,
  fetchUser,
}) => {
  const [galleryData, setGalleryData] = useState<GalleryData | null>(null);
  const screens = useBreakpoint();

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const [openGallery, setOpenGallery] = useState(false);

  const handleCloseGallery = () => {
    setOpenGallery(false);
  };
  const handleOpenGallery = (activity: GalleryData) => {
    setOpenGallery(true);
    setGalleryData(activity);
  };

  const hasActivities = student?.activities && student.activities.length > 0;

  return (
    <>
      <Card
        style={{
          backgroundColor: "#F8F9FA",
          borderRadius: "12px",
          padding: screens.xs ? "12px" : "16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: screens.xs ? "column" : "row",
            justifyContent: "space-between",
            alignItems: screens.xs ? "flex-start" : "center",
            marginBottom: "16px",
            gap: screens.xs ? "12px" : 0,
          }}
        >
          <Title
            level={4}
            style={{
              margin: 0,
              fontSize: screens.xs ? "18px" : "20px",
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
              height: screens.xs ? "32px" : "auto",
            }}
            onClick={handleOpen}
          >
            Add More
          </Button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {hasActivities ? (
            student?.activities?.map((activity, index) => (
              <Card
                key={index}
                style={{
                  margin: 0,
                  borderRadius: "8px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                    flexWrap: screens.xs ? "wrap" : "nowrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: screens.xs ? "column" : "row",
                      gap: screens.xs ? "4px" : "16px",
                      alignItems: screens.xs ? "flex-start" : "center",
                      flex: 1,
                    }}
                  >
                    <Text
                      strong
                      style={{
                        fontSize: "14px",
                        minWidth: screens.xs ? "100%" : "120px",
                      }}
                    >
                      {activity.category}
                    </Text>
                    <Text
                      style={{
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      {activity.skill}
                    </Text>
                    <Text
                      style={{
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      {activity.achievement}
                    </Text>
                  </div>

                  <Button
                    type="link"
                    icon={<PictureOutlined style={{ color: "#4DC4FF" }} />}
                    style={{
                      padding: 0,
                      height: "auto",
                      whiteSpace: "nowrap",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                    onClick={() => {
                      handleOpenGallery(activity);
                    }}
                  >
                    {" "}
                    Gallery
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <Card
              style={{
                margin: 0,
                borderRadius: "8px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                width: "100%",
                textAlign: "center",
              }}
            >
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Text type="secondary">
                    No extracurricular activities added
                  </Text>
                }
              />
            </Card>
          )}
        </div>
      </Card>
      <ExtraCurricularActivityDrawer
        open={open}
        handleClose={handleClose}
        handleOpen={handleOpen}
        student={student}
        fetchUser={fetchUser}
      />
      <GalleryDrawer
        open={openGallery}
        onClose={handleCloseGallery}
        datas={galleryData}
      />
    </>
  );
};

export default ExtracurricularActivities;
