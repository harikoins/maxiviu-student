import { Button, Col, Drawer, Form, Input, Row, Space } from "antd";
import React, { useEffect } from "react";
import { updatestudent } from "../../services/studentService";
import type { studentType } from "../../services/studentService";
import { useToast } from '../../hook/useToast';

// Define props interface for the component
interface StoryCardsDrawerProps {
  open: boolean;
  onClose: () => void;
  student: studentType;
  type: keyof studentType;
  fetchUser:()=>void;
}

const StoryCardsDrawer: React.FC<StoryCardsDrawerProps> = ({
  open,
  onClose,
  student,
  type,
  fetchUser
}) => {
  const toast = useToast();
  const [form] = Form.useForm();

  // Update form values when drawer opens or data changes
  useEffect(() => {
    if (open) {
      // Reset form and update field value
      form.resetFields();
      form.setFieldsValue({ [type]: student[type] || "" });
    }
  }, [open, student, type, form]);

  // Handle form submission
  const onFinish = async (values: Record<string, string>) => {
    try {
      await updatestudent(student.id, { ...student, ...values });
      toast.success("Student Details Updated Successfully.");
      fetchUser();
      onClose();
    } catch (error) {
      toast.error("Failed to update student details. Please try again.");
      console.error("Update Error:", error);
    }
  };

  return (
    <Drawer
      title="Update User Details"
      width={450}
      onClose={onClose}
      open={open}
      style={{ paddingBottom: 10 }}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name={type}
              label={type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
              rules={[
                {
                  required: true,
                  message: `Please enter ${type}`,
                },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder={`Please enter ${type}`}
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
  );
};

export default StoryCardsDrawer;
