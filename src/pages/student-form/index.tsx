import React, { useState } from "react";
import {
  Steps,
  Button,
  Form,
  Input,
  AutoComplete,
  DatePicker,
  Select,
} from "antd";
import useCustomTranslation from "../../hooks/useTranslation";

const { Option } = Select;

const { Step } = Steps;

const StudentForm: React.FC = () => {
  const { t } = useCustomTranslation();
  const [current, setCurrent] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>({});

  const technicalSkills = [
    "Communication",
    "Teamwork",
    "Problem Solving",
    "Leadership",
    "Time Management",
    "Critical Thinking",
  ];

  const softSkills = [
    "React",
    "Node.js",
    "Python",
    "Java",
    "SQL",
    "Data Analysis",
    "Machine Learning",
  ];

  const steps = [
    {
      title: t("studentform.personal"),
      content: (
        <Form
          layout="vertical"
          onFinish={(values) => handleFormSubmit(values, 0)}
        >
          <Form.Item
            name="firstname"
            label={t("studentform.firstname")}
            rules={[
              { required: true, message: t("studentform.firstnamevalidation") },
            ]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>
          <Form.Item
            name="lastname"
            label={t("studentform.lastname")}
            rules={[
              { required: true, message: t("studentform.lastnamevalidation") },
            ]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>
          <Form.Item
            name="mobile"
            label={t("studentform.mobile")}
            rules={[
              { required: true, message: t("studentform.mobilevalidation") },
            ]}
          >
            <Input placeholder="9878878787" type="number" />
          </Form.Item>
          <Form.Item
            name="headline"
            label={t("studentform.headline")}
            rules={[
              { required: true, message: t("studentform.headlinevalidation") },
            ]}
          >
            <Input placeholder="Software Engineer" />
          </Form.Item>
          <Form.Item
            name="website"
            label={t("studentform.website")}
            rules={[
              { required: true, message: t("studentform.websitevalidation") },
            ]}
          >
            <Input placeholder="johnportfolio.com" />
          </Form.Item>
          <Form.Item
            name="email"
            label={t("studentform.email")}
            rules={[
              {
                required: true,
                type: "email",
                message: t("studentform.invalidemail"),
              },
            ]}
          >
            <Input placeholder="john@example.com" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            {t("next")}
          </Button>
        </Form>
      ),
    },
    {
      title:  t("studentform.academic"),
      content: (
        <Form
          layout="vertical"
          onFinish={(values) => handleFormSubmit(values, 1)}
        >
          {/* College Field */}
          <Form.Item
            name="college"
            label={t("studentform.college")}
            rules={[
              { required: true, message: t("studentform.collegevalidation") },
            ]}
          >
            <AutoComplete
              placeholder="NIT College"
              options={[
                { value: "ABC University" },
                { value: "XYZ College" },
                { value: "PQR Institute" },
              ]}
              filterOption={(inputValue, option) =>
                option?.value
                  .toLowerCase()
                  .includes(inputValue.toLowerCase()) || false
              }
            />
          </Form.Item>

          {/* Degree Field */}
          <Form.Item
            name="degree"
            label={t("studentform.degree")}
            rules={[
              { required: true, message: t("studentform.degreevalidation") },
            ]}
          >
            <AutoComplete
              placeholder="BE"
              options={[
                { value: "B.Sc Computer Science" },
                { value: "B.Tech Information Technology" },
                { value: "B.A English" },
              ]}
              filterOption={(inputValue, option) =>
                option?.value
                  .toLowerCase()
                  .includes(inputValue.toLowerCase()) || false
              }
            />
          </Form.Item>

          {/* Department Field */}
          <Form.Item
            name="department"
            label={t("studentform.department")}
            rules={[
              {
                required: true,
                message: t("studentform.departmentvalidation"),
              },
            ]}
          >
            <AutoComplete
              placeholder="Computer Science"
              options={[
                { value: "Computer Science" },
                { value: "Mechanical Engineering" },
                { value: "Electrical Engineering" },
              ]}
              filterOption={(inputValue, option) =>
                option?.value
                  .toLowerCase()
                  .includes(inputValue.toLowerCase()) || false
              }
            />
          </Form.Item>

          {/* Course Field */}
          <Form.Item
            name="course"
            label={t("studentform.course")}
            rules={[
              { required: true, message: t("studentform.coursevalidation") },
            ]}
          >
            <AutoComplete
              placeholder="M.Tech (AI/ML)"
              options={[
                { value: "M.Tech (AI/ML)" },
                { value: "M.Tech (CAD/CAM)" },
                { value: "M.Tech (Power Engg.)" },
              ]}
              filterOption={(inputValue, option) =>
                option?.value
                  .toLowerCase()
                  .includes(inputValue.toLowerCase()) || false
              }
            />
          </Form.Item>

          <Form.Item
            name="joinYear"
            label={t("studentform.joinyear")}
            rules={[
              { required: true, message: t("studentform.joinyearvalidation") },
            ]}
          >
            <DatePicker
              picker="year"
              style={{ width: "100%" }}
              placeholder={"2023"}
            />
          </Form.Item>

          {/* Complete Year Field using DatePicker (Year Picker) */}
          <Form.Item
            name="completeYear"
            label={t("studentform.completeyear")}
            rules={[
              {
                required: true,
                message: t("studentform.completeyearvalidation"),
              },
            ]}
          >
            <DatePicker
              picker="year"
              style={{ width: "100%" }}
              placeholder={"2026"}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            {t("next")}
          </Button>
        </Form>
      ),
    },

    {
      title:  t("studentform.skills"),
      content: (
        <Form
          layout="vertical"
          onFinish={(values) => handleFormSubmit(values, 2)}
        >
          <Form.Item
            name="softskills"
            label={t("studentform.softskills")}
            rules={[
              {
                required: true,
                message: t("studentform.softskillsvalidation"),
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Java, Python"
              allowClear
              showSearch
              filterOption={(input, option) =>
                option?.children
                  ? option.children
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  : false
              }
            >
              {softSkills.map((skill) => (
                <Option key={skill} value={skill}>
                  {skill}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="technicalskills"
            label={t("studentform.technicalskills")}
            rules={[
              {
                required: true,
                message: t("studentform.technicalskillsvalidation"),
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Communication,Leadership"
              allowClear
              showSearch
              filterOption={(input, option) =>
                option?.children
                  ? option.children
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  : false
              }
            >
              {technicalSkills.map((skill) => (
                <Option key={skill} value={skill}>
                  {skill}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit">
            {t("submit")}
          </Button>
        </Form>
      ),
    },
    
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormSubmit = (values: any, step: number) => {
    setFormData({ ...formData, ...values });
    if (step < steps.length - 1) setCurrent(step + 1);
  };

  const prev = () => setCurrent(current - 1);

  return (
    <div style={{ width: "700px", margin: "auto" }}>
      <Steps current={current} style={{ marginBottom: 20 }}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div>{steps[current].content}</div>
      <div style={{ marginTop: 20 }}>
        {current > 0 && (
          <Button onClick={prev} style={{ marginRight: 8 }}>
            {t("previous")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default StudentForm;
