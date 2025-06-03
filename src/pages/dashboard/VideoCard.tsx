import React, { useRef, useState } from "react";
import { Card, Button, message, Typography, Upload, Space } from "antd";
import { PlayCircleOutlined, UploadOutlined } from "@ant-design/icons";

const { Text } = Typography;

const VideoCard: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const beforeUpload = (file: File) => {
    const isVideo = file.type.startsWith('video/');
    if (!isVideo) {
      message.error('You can only upload video files!');
    }
    return isVideo;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpload = (info: any) => {
    if (info.file.status === 'done') {
      const url = URL.createObjectURL(info.file.originFileObj);
      setVideoUrl(url);
      message.success(`${info.file.name} file uploaded successfully`);
    }
  };

  const handlePlay = () => {
    if (videoUrl) {
      if (videoRef.current?.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current?.pause();
        setIsPlaying(false);
      }
    } else {
      message.info('Please upload a video first');
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  return (
    <Card
      className="video-card"
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto"
      }}
    >
      {videoUrl ? (
        <div style={{ position: "relative" }}>
          <video
            ref={videoRef}
            src={videoUrl}
            controls={isPlaying}
            className="w-100"
            style={{
              objectFit: "cover",
              width: "100%",
              height: "auto",
              maxHeight: "70vh",
              display: "block"
            }}
            onClick={handlePlay}
            onEnded={handleVideoEnd}
          />
          {!isPlaying && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "rgba(0,0,0,0.3)",
                cursor: "pointer"
              }}
              onClick={handlePlay}
            >
              <Button
                type="text"
                shape="circle"
                icon={<PlayCircleOutlined style={{ fontSize: "clamp(24px, 5vw, 48px)" }} />}
                style={{ 
                  backgroundColor: "transparent", 
                  border: "none",
                  color: "#fff"
                }}
              />
            </div>
          )}
        </div>
      ) : (
        <div
          className="d-flex flex-column justify-content-center align-items-center bg-light"
          style={{ 
            height: "250px",
            padding: "20px",
            textAlign: "center"
          }}
        >
          <Space direction="vertical" size="large">
            <Text type="secondary" style={{ fontSize: "clamp(14px, 2vw, 18px)" }}>
              Upload a video to get started
            </Text>
            <Upload
              accept="video/*"
              beforeUpload={beforeUpload}
              customRequest={({ file, onSuccess }) => {
                setTimeout(() => {
                  onSuccess?.("ok");
                  handleUpload({ file: { status: 'done', name: file ?? "", originFileObj: file } });
                }, 0);
              }}
              showUploadList={false}
            >
              <Button
                type="primary"
                icon={<UploadOutlined />}
                size="large"
              >
                Select Video
              </Button>
            </Upload>
          </Space>
        </div>
      )}
    </Card>
  );
};

export default VideoCard;
