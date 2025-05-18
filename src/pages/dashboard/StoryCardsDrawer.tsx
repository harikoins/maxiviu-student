import { Button, Col, Drawer, Form, Input, Row, Space } from "antd";
import React from "react";
import { toast, ToastContainer } from "react-toastify";
import { userDatas } from "../../stores/userStore";
import { updatestudent } from "../../services/studentService";

// Define props interface for the component
interface StoryCardsDrawerProps {
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const StoryCardsDrawer: React.FC<StoryCardsDrawerProps> = ({
  open,
  onClose,
  onUpdate,
}) => {
  const [form] = Form.useForm();

  // Success Notification
  const showSuccessToast = (message: string) => {
    toast.success(message, {
      position: "top-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };

  // Error Toast
  const showErrorToast = (message: string) => {
    toast.error(message, {
      position: "top-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };

  // Handle form submission
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = async (values: any) => {
    try {
      // Call the update function from studentService
      await updatestudent(Number(userDatas?.value?.id), values);
      console.log(values, "values");
      showSuccessToast("Student Details Updated Successfully.");

      onClose(); // Close the drawer on success
      onUpdate();
    } catch (error) {
      showErrorToast("Failed to update student details. Please try again.");
      console.error("Update Error:", error);
    }
  };

  return (
    <>
      <Drawer
        title="Update User Details"
        width={450}
        onClose={onClose}
        open={open}
        style={{ paddingBottom: 10 }} // Corrected style attribute
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            mystory: userDatas?.value?.mystory || "",
            mygoal: userDatas?.value?.mygoal || "",
            myachievement: userDatas?.value?.myachievement || "",
          }}
          onFinish={onFinish}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="mystory"
                label="My Story"
                rules={[
                  {
                    required: true,
                    message: "Please enter my story",
                  },
                ]}
              >
                <Input.TextArea rows={4} placeholder="Please enter my story" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="mygoal"
                label="My Goals"
                rules={[
                  {
                    required: true,
                    message: "Please enter my goals",
                  },
                ]}
              >
                <Input.TextArea rows={4} placeholder="Please enter my goals" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="myachievement"
                label="My Achievements"
                rules={[
                  {
                    required: true,
                    message: "Please enter my achievements",
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Please enter my achievements"
                />
              </Form.Item>
            </Col>
          </Row>
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        </Form>
      </Drawer>
      <ToastContainer />
    </>
  );
};

export default StoryCardsDrawer;
