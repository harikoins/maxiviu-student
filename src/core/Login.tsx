import React, { useState } from 'react';
import { Button, Form, Input, message, Typography } from 'antd';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const { Link } = Typography;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // Handle Registration
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRegister = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', values);
      message.success(response.data.message);
      setIsLogin(true); // Switch to login after successful registration
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle Login
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', values);
      message.success(response.data.message);
      localStorage.setItem('token', response.data.token);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Toggle between login and registration
  const toggleForm = () => setIsLogin(!isLogin);

  // Google Login Handlers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleGoogleLoginSuccess = (credentialResponse: any) => {
    console.log('Google login success:', credentialResponse);
    window.location.href = 'http://localhost:3900/users/google';
    message.success('Logged in with Google!');
  };

  const handleGoogleLoginFailure = () => {
    message.error('Google login failed!');
  };

  return (
    <GoogleOAuthProvider clientId="475280594440-24gu1pvpfhiq47cek3cchl8mduf01pms.apps.googleusercontent.com">
      <div style={{ 
        display: 'flex', justifyContent: 'center', alignItems: 'center', 
         backgroundColor: '#f0f2f5' 
      }}>
        <div style={{ 
          width: 400, padding: 20, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', 
          backgroundColor: '#fff', borderRadius: 8 
        }}>
          <h2 style={{ textAlign: 'center' }}>{isLogin ? 'Login' : 'Register'}</h2>
          <Form
            name={isLogin ? 'login' : 'register'}
            initialValues={{ remember: true }}
            onFinish={isLogin ? handleLogin : handleRegister}
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

            {!isLogin && (
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                rules={[
                  { required: true, message: 'Please confirm your password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            )}

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                {isLogin ? 'Log In' : 'Register'}
              </Button>
            </Form.Item>

            {isLogin && (
              <div style={{ marginTop: 10 }}>
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginFailure}
                  text="signin_with"
                />
              </div>
            )}
          </Form>

          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <Link onClick={toggleForm}>
              {isLogin ? 'New here? Register' : 'Already have an account? Login'}
            </Link>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;

