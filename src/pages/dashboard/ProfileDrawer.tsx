/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Drawer,
  Form,
  Input,
  Button,
  Space,
  Typography,
  Divider,
  Row,
  Col,
  Select,
} from "antd";
import {
  SaveOutlined,
  CloseOutlined,
  GithubOutlined,
  LinkedinOutlined,
  RedditOutlined,
  BehanceOutlined,
} from "@ant-design/icons";
import type { studentType } from "../../services/studentService";
import { updatestudent } from "../../services/studentService";
import { showSuccessToast,showErrorToast } from "../../utils/toaster";

const { Title, Text } = Typography;
const { Option } = Select;

interface ProfileDrawerProps {
  visible: boolean;
  onClose: () => void;
  student: studentType;
  fetchUser: () => void;
  initialValues?: {
    firstname: string;
    lastname: string;
    headline: string;
    city: string;
    state: string;
    country: string;
    email: string;
    pphoneno: string;
    sphoneno: string;
    website: string;
    profile_linkedin: string;
    profile_behance: string;
    profile_github: string;
  };
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  visible,
  onClose,
  student,
  fetchUser
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const getInitialValues = () => {
    return {
      firstname: student?.firstname || "",
      lastname: student?.lastname || "",
      headline: student?.headline || "",
      city: "Trichy",
      state: "Tamil Nadu",
      country: "Country",
      email: student?.email || "",
      pphoneno: student?.pphoneno || "",
      sphoneno: student?.sphoneno || "",
      website: student?.website || "",
      profile_linkedin: student?.profile_linkedin || "",
      profile_behance: student?.profile_behance || "",
      profile_github: student?.profile_github || "",
      profile_reddit: student?.profile_reddit || "",
    };
  };

  const onFinish = async (values: studentType) => {
    setLoading(true);
    try {
      await updatestudent(student.id,values);
      console.log("Profile updated:", values);
      showSuccessToast("Profile Updated Successfully")
      fetchUser();
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      showErrorToast("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      title={
        <Space>
          <Title level={4} style={{ marginBottom: 0 }}>
            Profile
          </Title>
          <Text type="secondary">ID No: ANUS9603</Text>
        </Space>
      }
      width={600}
      onClose={onClose}
      open={visible}
      extra={
        <Space>
          <Button icon={<CloseOutlined />} onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={() => form.submit()}
            loading={loading}
          >
            Save
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={getInitialValues()}
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="firstname"
              label="First Name"
              rules={[{ required: true, message: "Please enter first name" }]}
            >
              <Input placeholder="First Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lastname"
              label="Last Name"
              rules={[{ required: true, message: "Please enter last name" }]}
            >
              <Input placeholder="Last Name" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="headline"
          label="Headline"
          rules={[{ required: true, message: "Please enter your headline" }]}
        >
          <Input.TextArea
            placeholder="Your professional headline"
            autoSize={{ minRows: 2, maxRows: 4 }}
          />
        </Form.Item>

        <Divider orientation="left">Location</Divider>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: "Please enter city" }]}
            >
              <Input placeholder="City" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="state"
              label="State"
              rules={[{ required: true, message: "Please enter state" }]}
            >
              <Input placeholder="State" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="country"
              label="Country"
              rules={[{ required: true, message: "Please enter country" }]}
            >
              <Select placeholder="Select country">
                <Option value="India">India</Option>
                <Option value="United States">United States</Option>
                <Option value="United Kingdom">United Kingdom</Option>
                <Option value="Canada">Canada</Option>
                <Option value="Australia">Australia</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Contact Information</Divider>

        <Form.Item
          name="email"
          label="Email ID"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Email address" type="email" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="pphoneno" label="Primary Phone">
              <Input placeholder="Primary phone number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="sphoneno" label="Secondary Phone">
              <Input placeholder="Secondary phone number" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="website"
          label="Website"
        >
          <Input placeholder="https://example.com" prefix="https://" />
        </Form.Item>

        <Divider orientation="left">Public Profiles</Divider>

        <Form.Item
          name="profile_linkedin"
          label={
            <Space>
              <LinkedinOutlined style={{ color: "#0077B5" }} />
              LinkedIn
            </Space>
          }
        >
          <Input placeholder="https://linkedin.com/in/username" />
        </Form.Item>

        <Form.Item
          name="profile_github"
          label={
            <Space>
              <GithubOutlined />
              GitHub
            </Space>
          }
        >
          <Input placeholder="https://github.com/username" />
        </Form.Item>

        <Form.Item
          name="profile_behance"
          label={
            <Space>
              <BehanceOutlined />
              Behance
            </Space>
          }
        >
          <Input placeholder="https://behance.net/username" />
        </Form.Item>
        <Form.Item
          name="profile_reddit"
          label={
            <Space>
              <RedditOutlined />
              Reddit
            </Space>
          }
        >
          <Input placeholder="https://reddit.net/username" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ProfileDrawer;
