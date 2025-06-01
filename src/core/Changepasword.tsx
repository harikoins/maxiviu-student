import React from 'react';
import { Modal, Form, Input, message, Button } from 'antd';
import { KeyOutlined } from '@ant-design/icons';
import { validatePassword } from '../utils/validators';

export type ChangePasswordFormData = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

interface ChangePasswordDialogProps {
  dialog: { status: boolean };
  setDialog: React.Dispatch<React.SetStateAction<{ status: boolean }>>;
  onSubmit: (data: ChangePasswordFormData) => void;
}

const ChangePasswordModal: React.FC<ChangePasswordDialogProps> = ({ dialog, setDialog, onSubmit }) => {
  const [form] = Form.useForm<ChangePasswordFormData>();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
      setDialog((prev) => ({ ...prev, status: false }));
    } catch (error) {
      // Validation failed
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setDialog((prev) => ({ ...prev, status: false }));
  };

  return (
    <Modal
      title="Change Password"
      centered
      open={dialog?.status}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Change"
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label="Old Password"
          name="oldPassword"
          rules={[{ required: true, message: 'Please enter your old password' }]}
        >
          <Input.Password prefix={<KeyOutlined />} />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            { validator: validatePassword }]}
        >
          <Input.Password prefix={<KeyOutlined />} />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
          { required: true, message: "Please confirm your password!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("newPassword") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("The two passwords do not match!")
              );
            },
          }),
        ]}
        >
          <Input.Password prefix={<KeyOutlined />} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
