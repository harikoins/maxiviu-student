import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Card,
  Typography,
  Alert,
  Divider,
  Space,
} from "antd";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  type CredentialResponse,
} from "@react-oauth/google";
import axiosInstance from "../config/axiosInstance";
import { useNavigate } from "react-router-dom";
import { setUser } from "../signals/userSignals";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { validateEmail, validatePassword } from "../utils/validators";
import {
  createSignedupUser,
  loginUser,
  type userType,
} from "../services/userService";

const { Title, Text, Link } = Typography;

type AuthMode = "login" | "signup" | "forgot";

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.post("users/auth/google", {
        token: credentialResponse.credential,
      });
      setUser(response.data);
      if (response.data.isCreated) {
        navigate("/dashboard");
      } else {
        navigate("/student-form");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Google authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google authentication failed. Please try again.");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLogin = async (values: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await loginUser(values);
      setUser(response);
      if (response.isCreated) {
        navigate("/dashboard");
      } else {
        navigate("/student-form");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err, "err");
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSignup = async (values: userType) => {
    try {
      setLoading(true);
      setError(null);
      await createSignedupUser(values);
      setSuccessMessage(
        "Registration successful! Please check your email to verify your account."
      );
      setMode("login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (values: { email: string }) => {
    try {
      setLoading(true);
      setError(null);
      await axiosInstance.post("users/auth/forgot-password", values);
      setSuccessMessage(
        "Password reset link sent to your email. Please check your inbox."
      );
      setMode("login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const formItemStyle = { marginBottom: 12 };
  const inputStyle = { fontSize: 14, padding: '8px 12px' };
  const buttonStyle = { height: 36, fontSize: 14 };

  const renderLoginForm = () => (
    <Form
      name="login"
      initialValues={{ remember: true }}
      onFinish={handleLogin}
      layout="vertical"
      style={{ maxWidth: '100%' }}
    >
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: 16, fontSize: 13 }}
        />
      )}
      {successMessage && (
        <Alert
          message={successMessage}
          type="success"
          showIcon
          style={{ marginBottom: 16, fontSize: 13 }}
        />
      )}

      <Form.Item
        label={<span style={{ fontSize: 13 }}>Email</span>}
        name="email"
        rules={[
          { required: true, message: "Please input your email!" },
          { validator: validateEmail },
        ]}
        style={formItemStyle}
      >
        <Input
          prefix={<MailOutlined style={{ fontSize: 13 }} />}
          placeholder="Enter your email"
          style={inputStyle}
        />
      </Form.Item>

      <Form.Item
        label={<span style={{ fontSize: 13 }}>Password</span>}
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
        style={formItemStyle}
      >
        <Input.Password
          prefix={<LockOutlined style={{ fontSize: 13 }} />}
          placeholder="Enter your password"
          style={inputStyle}
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 8 }}>
        <Button
          type="primary"
          htmlType="submit"
          block
          style={buttonStyle}
          loading={loading}
        >
          Log In
        </Button>
      </Form.Item>

      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <Link style={{ fontSize: 13 }} onClick={() => setMode("forgot")}>Forgot password?</Link>
      </div>

      <Divider style={{ fontSize: 12, margin: '12px 0' }}>Or</Divider>

      <Space direction="vertical" style={{ width: "100%", marginBottom: 8 }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          text="continue_with"
          size="medium"
          width="100%"
        />
      </Space>

      <div style={{ textAlign: "center", marginTop: 8 }}>
        <Text style={{ fontSize: 13 }}>Don't have an account? </Text>
        <Link style={{ fontSize: 13 }} onClick={() => setMode("signup")}>Sign up</Link>
      </div>
    </Form>
  );

  const renderSignupForm = () => (
    <Form
      name="signup"
      onFinish={handleSignup}
      layout="vertical"
      scrollToFirstError
      style={{ maxWidth: '100%' }}
    >
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: 16, fontSize: 13 }}
        />
      )}

      <Form.Item
        label={<span style={{ fontSize: 13 }}>Full Name</span>}
        name="fullName"
        rules={[{ required: true, message: "Please input your full name!" }]}
        style={formItemStyle}
      >
        <Input
          prefix={<UserOutlined style={{ fontSize: 13 }} />}
          placeholder="Enter your full name"
          style={inputStyle}
        />
      </Form.Item>

      <Form.Item
        label={<span style={{ fontSize: 13 }}>Email</span>}
        name="email"
        rules={[{ validator: validateEmail }]}
        style={formItemStyle}
      >
        <Input
          prefix={<MailOutlined style={{ fontSize: 13 }} />}
          placeholder="Enter your email"
          style={inputStyle}
        />
      </Form.Item>

      <Form.Item
        label={<span style={{ fontSize: 13 }}>Password</span>}
        name="password"
        rules={[{ validator: validatePassword }]}
        hasFeedback
        style={formItemStyle}
      >
        <Input.Password
          prefix={<LockOutlined style={{ fontSize: 13 }} />}
          placeholder="Create a password"
          style={inputStyle}
        />
      </Form.Item>

      <Form.Item
        label={<span style={{ fontSize: 13 }}>Confirm Password</span>}
        name="confirmPassword"
        dependencies={["password"]}
        rules={[
          { required: true, message: "Please confirm your password!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("The two passwords do not match!")
              );
            },
          }),
        ]}
        style={formItemStyle}
      >
        <Input.Password
          prefix={<LockOutlined style={{ fontSize: 13 }} />}
          placeholder="Confirm your password"
          style={inputStyle}
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 8 }}>
        <Button
          type="primary"
          htmlType="submit"
          block
          style={buttonStyle}
          loading={loading}
        >
          Sign Up
        </Button>
      </Form.Item>

      <div style={{ textAlign: "center" }}>
        <Text style={{ fontSize: 13 }}>Already have an account? </Text>
        <Link style={{ fontSize: 13 }} onClick={() => setMode("login")}>Log in</Link>
      </div>
    </Form>
  );

  const renderForgotPasswordForm = () => (
    <Form
      name="forgotPassword"
      onFinish={handleForgotPassword}
      layout="vertical"
      style={{ maxWidth: '100%' }}
    >
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: 16, fontSize: 13 }}
        />
      )}
      {successMessage && (
        <Alert
          message={successMessage}
          type="success"
          showIcon
          style={{ marginBottom: 16, fontSize: 13 }}
        />
      )}

      <Text style={{ fontSize: 13, display: 'block', marginBottom: 16 }}>
        Enter the email address associated with your account and we'll send you
        a link to reset your password.
      </Text>

      <Form.Item
        label={<span style={{ fontSize: 13 }}>Email</span>}
        name="email"
        rules={[
          { required: true, message: "Please input your email!" },
          { validator: validateEmail },
        ]}
        style={formItemStyle}
      >
        <Input
          prefix={<MailOutlined style={{ fontSize: 13 }} />}
          placeholder="Enter your email"
          style={inputStyle}
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 8 }}>
        <Button
          type="primary"
          htmlType="submit"
          block
          style={buttonStyle}
          loading={loading}
        >
          Send Reset Link
        </Button>
      </Form.Item>

      <div style={{ textAlign: "center" }}>
        <Link style={{ fontSize: 13 }} onClick={() => setMode("login")}>Back to login</Link>
      </div>
    </Form>
  );

  return (
    <GoogleOAuthProvider clientId="475280594440-24gu1pvpfhiq47cek3cchl8mduf01pms.apps.googleusercontent.com">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f0f2f5",
          padding: "16px",
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: 400,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: 8,
            padding: "16px",
          }}
          bodyStyle={{ padding: "16px" }}
        >
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <Title level={4} style={{ marginBottom: 8 }}>
              {mode === "login" && "Welcome Back"}
              {mode === "signup" && "Create Your Account"}
              {mode === "forgot" && "Reset Your Password"}
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              {mode === "login" && "Log in to access your account"}
              {mode === "signup" && "Join us today to get started"}
              {mode === "forgot" && "We'll help you regain access"}
            </Text>
          </div>

          {mode === "login" && renderLoginForm()}
          {mode === "signup" && renderSignupForm()}
          {mode === "forgot" && renderForgotPasswordForm()}

          <div style={{ marginTop: 16, textAlign: "center" }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              By continuing, you agree to our <Link style={{ fontSize: 12 }}>Terms of Service</Link> and{" "}
              <Link style={{ fontSize: 12 }}>Privacy Policy</Link>
            </Text>
          </div>
        </Card>
      </div>
    </GoogleOAuthProvider>
  );
};

export default AuthPage;