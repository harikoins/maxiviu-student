import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';


const { Header, Content, Footer } = Layout;

const App: React.FC = () => {


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between', // Aligns content to the left and right
          padding: '0 20px',
        }}
      >
        <div className="logo" style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
          Maxivu
        </div>
        {/* Other header content or navigation can go here */}
      </Header>
      <Content style={{ padding: '20px' }}>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Maxiviu ©{new Date().getFullYear()} Created by KoInnovation
      </Footer>
    </Layout>
  );
};

export default App;
