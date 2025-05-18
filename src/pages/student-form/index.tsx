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

  const [current, setCurrent] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>({});

  const [loggedUserDetails, setLoggedUserDetails] = useState<UserType | null>(
    null
  );

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const username = params.get("username");
  const email = params.get("email");
  const id = Number(params.get("id"));
  const studentid = Number(params.get("studentid"));

  useEffect(() => {
    if (token && username && email && id) {
      const loginuser: UserType = {
        username,
        email,
        accessToken: token,
        id,
        studentid,
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
      title: "Personal",
      content: (
        <Form
          layout="vertical"
          onFinish={(values) => handleFormSubmit(values, 0)}
        >
          <Form.Item
            name="firstname"
            label="First Name"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>
          <Form.Item
            name="lastname"
            label="Last Name"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>
          <Form.Item
            name="mobile"
            label="Mobile"
            rules={[{ required: true, message: "Please enter mobile" }]}
          >
            <Input placeholder="9878878787" type="number" />
          </Form.Item>
          <Form.Item
            name="headline"
            label="Headline"
            rules={[{ required: true, message: "Please enter headline" }]}
          >
            <Input placeholder="Software Engineer" />
          </Form.Item>
          <Form.Item
            name="website"
            label="Website"
            rules={[{ required: true, message: "Please enter website" }]}
          >
            <Input placeholder="johnportfolio.com" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter valid email",
              },
            ]}
          >
            <Input placeholder="john@example.com" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Next
          </Button>
        </Form>
      ),
    },
    {
      title: "Academic",
      content: (
        <Form
          layout="vertical"
          onFinish={(values) => handleFormSubmit(values, 1)}
        >
          {/* College Field */}
          <Form.Item
            name="college"
            label="College"
            rules={[{ required: true, message: "Please select college" }]}
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
            label="Degree"
            rules={[{ required: true, message: "Please select degree" }]}
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
            label="Department"
            rules={[
              {
                required: true,
                message: "Please select department",
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
            label="Course"
            rules={[{ required: true, message: "Please select course" }]}
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
            label="Join Year"
            rules={[{ required: true, message: "Please select join year" }]}
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
            label="Complete Year"
            rules={[
              {
                required: true,
                message: "Please select complete year",
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
            Next
          </Button>
        </Form>
      ),
    },

    {
      title: "Skills",
      content: (
        <Form
          layout="vertical"
          onFinish={(values) => handleFormSubmit(values, 2)}
        >
          <Form.Item
            name="softskills"
            label="Soft Skills"
            rules={[
              {
                required: true,
                message: "Please select soft skills",
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
            label="Technical Skills"
            rules={[
              {
                required: true,
                message: "Please select technical skills",
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
            Submit
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
          navigate(
            `/dashboard?token=${token}&username=${username}&email=${email}&id=${id}&studentid=${response?.id}`
          );
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
            Previous
          </Button>
        )}
      </div>
    </div>
  );
};

export default StudentForm;
