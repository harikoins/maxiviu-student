import React, { useState } from 'react';
import { Button, Form, Input, Layout, message, Typography } from 'antd';
import { GoogleLogin } from 'react-google-login';

const { Link } = Typography;

type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
  };
 
const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleGoogleLoginSuccess = (response: any) => {
    console.log('Google login success:', response);
    message.success('Logged in with Google!');
  };

  const handleGoogleLoginFailure = (error: any) => {
    console.error('Google login error:', error);
    message.error('Google login failed!');
  };

  const onFinish = (values: any) => {
    setLoading(true);
    console.log('Login Form Data:', values);
    // Handle form login logic here
    setLoading(false);
  };

  return (
   
        <div style={{ width: 400, padding: 20, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
          <h2 style={{ textAlign: 'center' }}>Login</h2>
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Log In
              </Button>
            </Form.Item>

            <GoogleLogin
              clientId="YOUR_GOOGLE_CLIENT_ID"
              buttonText="Login with Google"
              onSuccess={handleGoogleLoginSuccess}
              onFailure={handleGoogleLoginFailure}
              cookiePolicy={'single_host_origin'}
              style={{ width: '100%' }}
            />
            
          </Form>
          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <Link href="#" onClick={() => message.info('Forgot password clicked!')}>
              Forgot Password?
            </Link>
          </div>
        </div>
    
  );
};

export default LoginPage;