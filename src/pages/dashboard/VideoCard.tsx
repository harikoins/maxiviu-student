import React, { useRef, useState } from "react";
import { Card, Button, message } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";

const VideoCard: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoUrl) {
      if (videoRef.current?.paused) {
        videoRef.current.play();
      } else {
        videoRef?.current?.pause();
      }
    } else {
      message.error("No video file available");
      setVideoUrl("");
    }
  };

  return (
    <Card
      className="rounded-4"
      bordered={false}
      style={{ position: "relative", overflow: "hidden" }}
    >
      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          className="w-100 rounded-4"
          style={{ objectFit: "cover", height: "100%" }}
        />
      ) : (
        <div
          onClick={handlePlay}
          className="d-flex justify-content-center align-items-center bg-dark rounded-4"
          style={{ height: "250px", cursor: "pointer" }}
        >
          <Button
            type="primary"
            shape="circle"
            icon={<PlayCircleOutlined style={{ fontSize: 40 }} />}
            size="large"
            style={{ backgroundColor: "transparent", border: "none" }}
          />
        </div>
      )}
    </Card>
  );
};

export default VideoCard;
