import React, { useEffect, useState } from "react";
import { Drawer, Card, Typography, Divider, Image, Space } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
const apiUrl = import.meta.env.VITE_API_URL;

const { Text } = Typography;

interface GalleryData {
  category: string;
  skill: string;
  achievement: string;
  description: string;
  filename: string;
  filePath: string;
}

interface CertificateDrawerProps {
  open: boolean;
  onClose: () => void;
  datas: GalleryData | null;
}

const GalleryDrawer: React.FC<CertificateDrawerProps> = ({
  open,
  onClose,
  datas,
}) => {
  const [showDatas, setShowDatas] = useState<GalleryData[]>([]);

  useEffect(() => {
    if (!datas) return;

    const filePaths = datas.filePath?.split("|") || [];
    const fileNames = datas.filename?.split("|") || [];

    const mappedDatas = filePaths.map((filePath, index) => ({
      ...datas,
      filename: fileNames[index] || "",
      filePath: `${apiUrl}/${filePath}`,
    }));

    setShowDatas(mappedDatas);
  }, [datas]);

  const isPdf = (filename: string) => {
    return filename?.toLowerCase().endsWith(".pdf");
  };

  return (
    <Drawer
      title="Gallery"
      placement="right"
      width={600}
      onClose={onClose}
      open={open}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {showDatas.map((data: GalleryData, index: number) => (
          <Card
            key={index}
            style={{
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              borderRadius: 8,
            }}
          >
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              <div style={{ textAlign: "center" }}>
                {isPdf(data.filename) ? (
                  <a
                    href={data.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FilePdfOutlined
                      style={{ fontSize: 48, color: "#ff4d4f" }}
                    />
                    <div>View PDF</div>
                  </a>
                ) : (
                  <Image
                    src={data.filePath}
                    alt={data.filename}
                    style={{ maxHeight: 300, objectFit: "contain" }}
                    preview={{
                      toolbarRender: () => null, // Hide default toolbar
                    }}
                  />
                )}
              </div>

              <Divider style={{ margin: "8px 0" }} />

              <div>
                <Text strong>Category: </Text>
                <Text>{data.category}</Text>
              </div>

               <div>
                <Text strong>Skill/Specialization: </Text>
                <Text>{data.skill}</Text>
              </div>

              <div>
                <Text strong>Description: </Text>
                <Text>{data.description}</Text>
              </div>

              <div>
                <Text strong>Achievement: </Text>
                <Text>{data.achievement}</Text>
              </div>

              <Divider style={{ margin: "8px 0" }} />
            </Space>
          </Card>
        ))}
      </div>
    </Drawer>
  );
};

export default GalleryDrawer;
