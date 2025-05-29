/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
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
import { showSuccessToast, showErrorToast } from "../../utils/toaster";
import type { countryType, stateType } from "../../services/countryService";
import { getCountryPage } from "../../services/countryService";

const { Title, Text } = Typography;
const { Option } = Select;

interface dropdownType {
  countries: {
    options: countryType[];
    selectedValue: number | null;
  };
}

interface ProfileDrawerProps {
  visible: boolean;
  onClose: () => void;
  student: studentType;
  fetchUser: () => void;
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  visible,
  onClose,
  student,
  fetchUser,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [dropdown, setDropdown] = useState<dropdownType>({
    countries: { options: [], selectedValue: null },
  });

  const [stateOptions, setStateOptions] = useState<stateType[]>([]);

  const handleCountryChange = (countryId: number) => {
    const selectedCountry = dropdown.countries.options.find(
      (c) => c.id === countryId
    );
    const states = selectedCountry?.states || [];
    setStateOptions(states);

    // Clear state when country changes
    form.setFieldsValue({ state: undefined });
  };

  async function fetchApis() {
    try {
      // Fetch all data concurrently
      const [countries] = await Promise.all([getCountryPage(0, 0)]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformItems = (items: any[]) =>
        items?.map((item) => ({
          ...item,
          value: item?.id,
          label: item?.name,
        })) || [];

      // Update the dropdown state with the transformed data
      const transformedCountries = transformItems(countries.items);

      setDropdown((prev) => ({
        ...prev,
        countries: {
          options: transformedCountries,
          selectedValue: student?.country?.id || null,
        },
      }));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to fetch API data:", error);
      showErrorToast(error.message || "An unexpected error occurred.");
    }
  }

  useEffect(() => {
    fetchApis();
  }, []);

  useEffect(() => {
    if (dropdown.countries.options.length > 0 && student?.country?.id) {
      const selectedCountry = dropdown.countries.options.find(
        (c) => c.id === student.country.id
      );
      setStateOptions(selectedCountry?.states || []);

      // Set form values once the dropdowns are ready
      form.setFieldsValue({
        country: student.country.id,
        state: student.state?.id,
      });
    }
  }, [dropdown.countries.options, student]);
  const getInitialValues = () => {
    return {
      firstname: student?.firstname || "",
      lastname: student?.lastname || "",
      headline: student?.headline || "",
      city: student?.city || "",
      state: student?.state?.id || undefined,
      country: student?.country?.id || undefined,
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
    const payload = {
      ...values,
      country_id: Number(values.country),
      state_id: Number(values.state),
    };
    try {
      await updatestudent(student.id, payload);
      showSuccessToast("Profile Updated Successfully");
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
              name="country"
              label="Country"
              rules={[{ required: true, message: "Please select country" }]}
            >
              <Select
                placeholder="Select country"
                showSearch
                onChange={handleCountryChange}
                filterOption={(input, option) =>
                  (option?.children?.toString() || "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {dropdown?.countries?.options?.map((country) => (
                  <Option key={country.id} value={country.id}>
                    {country.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="state"
              label="State"
              rules={[{ required: true, message: "Please select state" }]}
            >
              <Select
                placeholder="Select state"
                showSearch
                filterOption={(input, option) =>
                  (option?.children?.toString() || "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {stateOptions.map((state) => (
                  <Option key={state.id} value={state.id}>
                    {state.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: "Please enter city" }]}
            >
              <Input placeholder="City" />
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

        <Form.Item name="website" label="Website">
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
