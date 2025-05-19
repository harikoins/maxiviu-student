import React, { useState } from 'react';
import { Button, Form, Input, message, Typography } from 'antd';
import { GoogleOAuthProvider, GoogleLogin , type CredentialResponse } from '@react-oauth/google';
import axiosInstance from "../config/axiosInstance"; 
import { jwtDecode } from "jwt-decode";
const { Link } = Typography;

const LoginPage: React.FC = () => {

  const handleSuccess = async (credentialResponse:CredentialResponse) => {
    try {
        let response = await axiosInstance.post('users/auth/google',{ token : credentialResponse.credential })
        console.log(response);
    } catch (error) {
      console.log(error)
    }
  };

  const handleError = () => {
    console.log('Login Failed');
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
          <h2 style={{ textAlign: 'center' }}>{'Login'}</h2>
          <Form
            name={'login'}
            initialValues={{ remember: true }}
           // onFinish={isLogin ? handleLogin : handleRegister}
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
         

            <Form.Item>
              <Button type="primary" htmlType="submit" block >
                  Login
              </Button>
            </Form.Item>

          
              <div style={{ marginTop: 10 }}>
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={handleError}
                  text="signin_with"
                />
              </div>
          
          </Form>

          <div style={{ textAlign: 'center', marginTop: 10 }}>
            {/* <Link onClick={toggleForm}>
              {isLogin ? 'New here? Register' : 'Already have an account? Login'}
            </Link> */}
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;

