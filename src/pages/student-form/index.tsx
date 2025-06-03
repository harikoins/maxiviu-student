import React, { useState, useEffect } from "react";
import { Steps, Button, Form, Input, AutoComplete, DatePicker } from "antd";
import { setUser, userSignal, type UserType } from "../../signals/userSignals";
import type { courseType } from "../../services/courseService";
import type { departmentType } from "../../services/departmentService";
import type { degreeType } from "../../services/degreeService";
import { getcoursePage } from "../../services/courseService";
import { getdepartmentPage } from "../../services/departmentService";
import { getdegreePage } from "../../services/degreeService";
import { createstudent } from "../../services/studentService";
import { useNavigate } from "react-router-dom";
import { useToast } from '../../hook/useToast';

const { Step } = Steps;

const StudentForm: React.FC = () => {
  const toast = useToast();
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
      toast.error(error.message || "An unexpected error occurred.");
    }
  }

  const [current, setCurrent] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>({});

  const [loggedUserDetails, setLoggedUserDetails] = useState<UserType | null>(
    null
  );

  useEffect(() => {
    fetchApis();
    setLoggedUserDetails(userSignal.value);
  }, []);

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
          {/* Date of Birth Field */}
          <Form.Item
            name="dob"
            label="Date of Birth"
            rules={[{ required: true, message: "Please select date of birth" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Select date"
              format={"DD-MM-YYYY"}
            />
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
          {/* <Form.Item
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
          </Form.Item> */}

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
      title: "Social Links",
      content: (
        <Form
          layout="vertical"
          onFinish={(values) => handleFormSubmit(values, 2)}
        >
          <Form.Item
            name="profile_linkedin"
            label="Linkedin"
            rules={[{ required: true, message: "Please enter linkedin link" }]}
          >
            <Input placeholder="(e.g., https://www.linkedin.com/in/yourname)" />
          </Form.Item>
          <Form.Item
            name="profile_github"
            label="Github"
            rules={[{ required: true, message: "Please enter github link" }]}
          >
            <Input placeholder="(e.g., https://github.com/yourusername)" />
          </Form.Item>
          <Form.Item
            name="profile_behance"
            label="Behance"
            rules={[{ required: true, message: "Please enter behance link" }]}
          >
            <Input placeholder="(e.g., https://www.behance.net/yourname)" />
          </Form.Item>
          <Form.Item
            name="profile_reddit"
            label="Reddit"
            rules={[{ required: true, message: "Please enter reddit link" }]}
          >
            <Input placeholder="(e.g., https://www.reddit.in/yourname)" />
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
        profile_behance: updatedFormData.profile_behance,
        profile_reddit: updatedFormData.profile_reddit,
        profile_github: updatedFormData.profile_github,
        profile_linkedin: updatedFormData.profile_linkedin,
        dob: updatedFormData.dob.toDate(),
      };
      try {
        const response = await createstudent(finalData);

        if (response?.id) {
          if (userSignal.value) {
            setUser({
              ...userSignal.value,
              studentid: response?.id,
            });
          }
          navigate(`/dashboard`);
          toast.success("Submitted Successfully.");
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error?.message || "An unexpected error occurred.");
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
