import React from "react";
import { Layout, Dropdown, Space, Avatar } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import {
  DownOutlined,
  SettingOutlined,
  CreditCardOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { clearUser } from "../signals/userSignals";

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const navigate = useNavigate();

  const items: MenuProps["items"] = [
    {
      label: "Settings",
      key: "settings",
      icon: <SettingOutlined />,
      onClick: () => navigate("/settings"),
    },
    {
      label: "Subscription",
      key: "subscription",
      icon: <CreditCardOutlined />,
      onClick: () => navigate("/subscription"),
    },
    {
      type: "divider",
    },
    {
      label: "Logout",
      key: "logout",
      icon: <LogoutOutlined />,
      danger: true, // This makes the item red
      onClick: () => {
        // Add your logout logic here
        // For example:
        clearUser();
        navigate("/");
      },
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between", // Aligns content to the left and right
          padding: "0 20px",
        }}
      >
        <div
          className="logo"
          style={{ color: "white", fontSize: "24px", fontWeight: "bold" }}
        >
          Maxivu
        </div>
        <Dropdown menu={{ items }} trigger={["click"]}>
          <a
            onClick={(e) => e.preventDefault()}
            style={{ textDecoration: "none", color: "#ffff" }}
          >
            <Space>
              Ramesh
              <Avatar
                size="large"
                icon={<UserOutlined />}
                style={{ backgroundColor: "#4096FF" }}
              />
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </Header>
      <Content style={{ padding: "20px" }}>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Maxiviu ©{new Date().getFullYear()} Created by KoInnovation
      </Footer>
    </Layout>
  );
};

export default App;
