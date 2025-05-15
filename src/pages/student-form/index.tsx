import React, { useState, useEffect } from "react";
import {
  Steps,
  Button,
  Form,
  Input,
  AutoComplete,
  DatePicker,
  Select,
  message,
  notification,
} from "antd";
import useCustomTranslation from "../../hooks/useTranslation";
import { setUser, type UserType } from "../../signals/userSignals";
import type { courseType } from "../../services/courseService";
import type { departmentType } from "../../services/departmentService";
import type { degreeType } from "../../services/degreeService";
import { getcoursePage } from "../../services/courseService";
import { getdepartmentPage } from "../../services/departmentService";
import { getdegreePage } from "../../services/degreeService";
import { createstudent } from "../../services/studentService";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const { Step } = Steps;

const StudentForm: React.FC = () => {
  const navigate = useNavigate();
  interface dropdownType {
    courses: {
      options: courseType[];
      selectedValue: number | null;
    };
    departments: {
      options: departmentType[];
      selectedValue: number | null;
    };
    degrees: {
      options: degreeType[];
      selectedValue: number | null;
    };
  }

  const [dropdown, setDropdown] = useState<dropdownType>({
    courses: { options: [], selectedValue: null },
    departments: { options: [], selectedValue: null },
    degrees: { options: [], selectedValue: null },
  });

  async function fetchApis() {
    try {
      // Fetch all data concurrently
      const [course, departments, degrees] = await Promise.all([
        getcoursePage(0, 0),
        getdepartmentPage(0, 0),
        getdegreePage(0, 0),
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformItems = (items: any[]) =>
        items?.map((item) => ({
          ...item,
          value: item?.name,
          label: item?.name,
        })) || [];

      // Update the dropdown state with the transformed data
      setDropdown((prev) => ({
        ...prev,
        courses: {
          options: transformItems(course.items),
          selectedValue: null,
        },
        departments: {
          options: transformItems(departments.items),
          selectedValue: null,
        },
        degrees: {
          options: transformItems(degrees.items),
          selectedValue: null,
        },
      }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to fetch API data:", error);

      notification.error({
        message: "API Error",
        description: error.message || "An unexpected error occurred.",
        placement: "topRight",
      });
    }
  }

  useEffect(() => {
    fetchApis();
  }, []);

  const { t } = useCustomTranslation();
  const [current, setCurrent] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>({});

  const [loggedUserDetails, setLoggedUserDetails] = useState<UserType | null>(
    null
  );
  useEffect(() => {
    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const username = params.get("username");
    const email = params.get("email");
    const id = Number(params.get("id"));
    const studentid = Number(params.get("studentid"));

    if (token && username && email && id) {
      const loginuser: UserType = {
        username,
        email,
        accessToken: token,
        id,
        studentid
      };

      // Set user data and token
      setUser(loginuser);
      setLoggedUserDetails(loginuser);
      localStorage.setItem("maxiviu_student", JSON.stringify(loginuser));

      message.success("Logged in with Google!");
    }
  }, []);

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
      title: t("studentform.academic"),
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
              options={dropdown?.degrees?.options}
              onSelect={(value) => {
                const selected = dropdown.degrees.options.find(
                  (item) => item.name === value
                );
                if (selected) {
                  setDropdown((prev) => ({
                    ...prev,
                    degrees: { ...prev.degrees, selectedValue: selected.id }, // Store the ID
                  }));
                }
              }}
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
              options={dropdown?.departments?.options}
              onSelect={(value) => {
                const selected = dropdown.departments.options.find(
                  (item) => item.name === value
                );
                if (selected) {
                  setDropdown((prev) => ({
                    ...prev,
                    departments: {
                      ...prev.departments,
                      selectedValue: selected.id,
                    }, // Store the ID
                  }));
                }
              }}
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
              options={dropdown?.courses?.options}
              onSelect={(value) => {
                const selected = dropdown.courses.options.find(
                  (item) => item.name === value
                );
                if (selected) {
                  setDropdown((prev) => ({
                    ...prev,
                    courses: {
                      ...prev.courses,
                      selectedValue: selected.id,
                    }, // Store the ID
                  }));
                }
              }}
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
      title: t("studentform.skills"),
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
  const handleFormSubmit = async (values: any, step: number) => {
    const updatedFormData = { ...formData, ...values };

    if (updatedFormData.joinYear?.year) {
      updatedFormData.joinYear = updatedFormData.joinYear.year();
    }
    if (updatedFormData.completeYear?.year) {
      updatedFormData.completeYear = updatedFormData.completeYear.year();
    }

    setFormData(updatedFormData);

    if (step < steps.length - 1) {
      setCurrent(step + 1);
    } else {
      const finalData = {
        ...updatedFormData,
        join_year: updatedFormData.joinYear,
        complete_year: updatedFormData.completeYear,
        user_id: loggedUserDetails?.id,
        department_id: dropdown?.departments?.selectedValue,
        degree_id: dropdown?.degrees?.selectedValue,
        course_id: dropdown?.courses?.selectedValue,
        pphoneno: updatedFormData.mobile,
        sphoneno: updatedFormData.mobile,
      };
      try {
        const response = await createstudent(finalData);

        if (response?.id) {
          navigate("/dashboard");
        } else {
          notification.error({
            message: "Error",
            description: "An unexpected error occurred. Please try again.",
            placement: "topRight",
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        notification.error({
          message: "Submission Failed",
          description: error?.message || "An unexpected error occurred.",
          placement: "topRight",
        });
      }
    }
  };

  const prev = () => setCurrent(current - 1);

  return (
    <div style={{ width: "700px", margin: "auto" }}>
      <Steps current={current} style={{ marginBottom: 20 }}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} onClick={() => {}} />
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
