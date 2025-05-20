import React,{useEffect} from "react";
import {
  Drawer,
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Space,
  Divider,
  Row,
  Col,
  Grid,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import type { studentType } from "../../services/studentService";
import { showSuccessToast, showErrorToast } from "../../utils/toaster";
import {
  createBulkInternship,
  type internshipType,
} from "../../services/internshipService";
import {
  createBulkSoftSkill,
  type softSkillType,
} from "../../services/softskillsService";
import {
  createBulkTechnicalSkill,
  type technicalSkillType,
} from "../../services/technicalskillService";

const { Option } = Select;
const { useBreakpoint } = Grid;

interface SkillsDrawerProps {
  open: boolean;
  handleClose: () => void;
  handleOpen: () => void;
  student: studentType;
  fetchUser: () => void;
}

const SkillsDrawer: React.FC<SkillsDrawerProps> = ({
  open,
  handleClose,
  fetchUser,
  student,
}) => {
  const [form] = Form.useForm();
  const screens = useBreakpoint();

  const isMobile = !screens.lg;

  // Add this function inside your SkillsDrawer component, before the return statement
  const getInitialValues = () => {
    return {
      internship:
        student.internships?.map((internship) => ({
          role: internship.role,
          type: internship.type,
          organization: internship.organization,
          duration: internship.duration ? Number(internship.duration) : null,
          status: internship.status,
        })) || [],

      softSkills:
        student.softskills?.map((softskill) => ({
          skill: softskill.skill,
          trainingattended: softskill.trainingattended,
          evaluationstatus: softskill.evaluationstatus,
          mockinterview: softskill.mockinterview
            ? Number(softskill.mockinterview)
            : 0,
          bestscore: softskill.bestscore,
        })) || [],

      techSkills:
        student.technicalskills?.map((techskill) => ({
          skill: techskill.skill,
          expertiselevel: techskill.expertiselevel,
          evaluationstatus: techskill.evaluationstatus,
          noofprojects: techskill.noofprojects
            ? Number(techskill.noofprojects)
            : 0,
          mockinterview: techskill.mockinterview
            ? Number(techskill.mockinterview)
            : 0,
          bestscore: techskill.bestscore,
        })) || [],
    };
  };

  useEffect(() => {
    if (student) {
      form.resetFields();
      form.setFieldsValue(getInitialValues());
    }
  }, [student, form]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (values: any) => {
    try {
      const { internship = [], softSkills = [], techSkills = [] } = values;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const requests: Promise<any>[] = [];

      // 1. Handle Internships
      if (internship.length > 0) {
        const internshipData = internship.map((item: internshipType) => ({
          role: item.role,
          type: item.type,
          organization: item.organization || null,
          duration: item.duration || null,
          status: item.status,
          student_id: student.id,
        }));
        requests.push(
          createBulkInternship({ internshipDatas: internshipData })
        );
      }

      // 2. Handle Soft Skills
      if (softSkills.length > 0) {
        const softSkillsData = softSkills.map((item: softSkillType) => ({
          skill: item.skill,
          trainingattended: item.trainingattended || null, // Match backend field
          evaluationstatus: item.evaluationstatus,
          mockinterview: item.mockinterview || 0,
          bestscore: item.bestscore || null,
          student_id: student.id,
        }));
        requests.push(createBulkSoftSkill({ softSkillDatas: softSkillsData }));
      }

      // 3. Handle Technical Skills
      if (techSkills.length > 0) {
        const techSkillsData = techSkills.map((item: technicalSkillType) => ({
          skill: item.skill,
          expertiselevel: item.expertiselevel,
          evaluationstatus: item.evaluationstatus,
          noofprojects: item.noofprojects || 0,
          mockinterview: item.mockinterview || 0,
          bestscore: item.bestscore || null,
          student_id: student.id,
        }));
        requests.push(
          createBulkTechnicalSkill({ technicalSkillDatas: techSkillsData })
        );
      }

      // ⏱️ Execute all requests concurrently
      const responses = await Promise.all(requests);

      // Optionally check if any failed
      const hasError = responses.some((res) => res?.success === false);
      if (hasError) throw new Error("Some data could not be saved");

      showSuccessToast("Skills data saved successfully!");
      handleClose();
      fetchUser();
    } catch (error) {
      console.error("Error saving skills data:", error);
      showErrorToast("Failed to save skills data. Please try again.");
    }
  };

  const renderTechSkillHeaders = () => (
    <Row gutter={[16, 8]} style={{ marginBottom: 8 }}>
      <Col xs={24} sm={12} md={8} lg={5}>
        <div style={{ fontWeight: 500 }}>Skill</div>
      </Col>
      {!isMobile && (
        <>
          <Col sm={12} md={8} lg={4}>
            <div style={{ fontWeight: 500 }}>Expertise Level</div>
          </Col>
          <Col sm={12} md={8} lg={5}>
            <div style={{ fontWeight: 500 }}>Evaluation Status</div>
          </Col>
          <Col sm={8} md={6} lg={3}>
            <div style={{ fontWeight: 500 }}># of Projects</div>
          </Col>
          <Col sm={8} md={6} lg={3}>
            <div style={{ fontWeight: 500 }}># of Interviews</div>
          </Col>
          <Col sm={8} md={6} lg={3}>
            <div style={{ fontWeight: 500 }}>Best Score</div>
          </Col>
        </>
      )}
      <Col xs={24} sm={8} md={6} lg={1}>
        <div style={{ fontWeight: 500 }}>Action</div>
      </Col>
    </Row>
  );

  const renderSoftSkillHeaders = () => (
    <Row gutter={[16, 8]} style={{ marginBottom: 8 }}>
      <Col xs={24} sm={12} md={8} lg={5}>
        <div style={{ fontWeight: 500 }}>Skill</div>
      </Col>
      {!isMobile && (
        <>
          <Col sm={12} md={8} lg={5}>
            <div style={{ fontWeight: 500 }}>Training Attended</div>
          </Col>
          <Col sm={12} md={8} lg={4}>
            <div style={{ fontWeight: 500 }}>Evaluation Status</div>
          </Col>
          <Col sm={8} md={6} lg={3}>
            <div style={{ fontWeight: 500 }}># of Interviews</div>
          </Col>
          <Col sm={8} md={6} lg={3}>
            <div style={{ fontWeight: 500 }}>Best Score</div>
          </Col>
        </>
      )}
      <Col xs={24} sm={8} md={6} lg={1}>
        <div style={{ fontWeight: 500 }}>Action</div>
      </Col>
    </Row>
  );

  const renderInternshipHeaders = () => (
    <Row gutter={[16, 8]} style={{ marginBottom: 8 }}>
      <Col xs={24} sm={12} md={8} lg={5}>
        <div style={{ fontWeight: 500 }}>Role</div>
      </Col>
      {!isMobile && (
        <>
          <Col sm={6} md={4} lg={3}>
            <div style={{ fontWeight: 500 }}>Type</div>
          </Col>
          <Col sm={12} md={8} lg={5}>
            <div style={{ fontWeight: 500 }}>Organization</div>
          </Col>
          <Col sm={6} md={4} lg={3}>
            <div style={{ fontWeight: 500 }}>Duration (Months)</div>
          </Col>
          <Col sm={6} md={4} lg={3}>
            <div style={{ fontWeight: 500 }}>Status</div>
          </Col>
        </>
      )}
      <Col xs={24} sm={8} md={6} lg={1}>
        <div style={{ fontWeight: 500 }}>Action</div>
      </Col>
    </Row>
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderTechSkillFields = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { key, name, ...restField }: any,
    remove: (index: number) => void
  ) => (
    <div
      key={key}
      style={{
        marginBottom: 8,
        padding: 8,
        border: "1px solid #f0f0f0",
        borderRadius: 8,
      }}
    >
      {isMobile && (
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Technical Skill</div>
      )}
      <Row gutter={[16, 8]}>
        <Col xs={24} sm={12} md={8} lg={5}>
          <Form.Item
            {...restField}
            name={[name, "skill"]}
            label={isMobile ? "Skill" : undefined}
            rules={[{ required: true, message: "Required" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        {!isMobile ? (
          <>
            <Col sm={12} md={8} lg={4}>
              <Form.Item
                {...restField}
                name={[name, "expertiselevel"]}
                rules={[{ required: true, message: "Required" }]}
              >
                <Select>
                  <Option value="Practising">Practising</Option>
                  <Option value="Learning">Learning</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col sm={12} md={8} lg={5}>
              <Form.Item
                {...restField}
                name={[name, "evaluationstatus"]}
                rules={[{ required: true, message: "Required" }]}
              >
                <Select>
                  <Option value="Completed">Completed</Option>
                  <Option value="Yet to be evaluated">
                    Yet to be evaluated
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col sm={8} md={6} lg={3}>
              <Form.Item
                {...restField}
                name={[name, "noofprojects"]}
                rules={[{ required: true, message: "Required" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col sm={8} md={6} lg={3}>
              <Form.Item
                {...restField}
                name={[name, "mockinterview"]}
                rules={[{ required: true, message: "Required" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col sm={8} md={6} lg={3}>
              <Form.Item
                {...restField}
                name={[name, "bestscore"]}
                rules={[{ required: true, message: "Required" }]}
              >
                <Input placeholder="e.g. 90%" />
              </Form.Item>
            </Col>
          </>
        ) : (
          <>
            <Col xs={24}>
              <Form.Item
                {...restField}
                name={[name, "expertiselevel"]}
                label="Expertise Level"
                rules={[{ required: true, message: "Required" }]}
              >
                <Select>
                  <Option value="Practising">Practising</Option>
                  <Option value="Learning">Learning</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                {...restField}
                name={[name, "evaluationstatus"]}
                label="Evaluation Status"
                rules={[{ required: true, message: "Required" }]}
              >
                <Select>
                  <Option value="Completed">Completed</Option>
                  <Option value="Yet to be evaluated">
                    Yet to be evaluated
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={12}>
              <Form.Item
                {...restField}
                name={[name, "noofprojects"]}
                label="# of Projects"
                rules={[{ required: true, message: "Required" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={12}>
              <Form.Item
                {...restField}
                name={[name, "mockinterview"]}
                label="# of Interviews"
                rules={[{ required: true, message: "Required" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                {...restField}
                name={[name, "bestscore"]}
                label="Best Score"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input placeholder="e.g. 90%" />
              </Form.Item>
            </Col>
          </>
        )}
        <Col
          xs={24}
          sm={8}
          md={6}
          lg={1}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => remove(name)}
          />
        </Col>
      </Row>
    </div>
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderSoftSkillFields = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { key, name, ...restField }: any,
    remove: (index: number) => void
  ) => (
    <div
      key={key}
      style={{
        marginBottom: 8,
        padding: 8,
        border: "1px solid #f0f0f0",
        borderRadius: 8,
      }}
    >
      {isMobile && (
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Soft Skill</div>
      )}
      <Row gutter={[16, 8]}>
        <Col xs={24} sm={12} md={8} lg={5}>
          <Form.Item
            {...restField}
            name={[name, "skill"]}
            label={isMobile ? "Skill" : undefined}
            rules={[{ required: true, message: "Required" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        {!isMobile ? (
          <>
            <Col sm={12} md={8} lg={5}>
              <Form.Item {...restField} name={[name, "trainingattended"]}>
                <Input />
              </Form.Item>
            </Col>
            <Col sm={12} md={8} lg={4}>
              <Form.Item
                {...restField}
                name={[name, "evaluationstatus"]}
                rules={[{ required: true, message: "Required" }]}
              >
                <Select>
                  <Option value="Completed">Completed</Option>
                  <Option value="Yet to be evaluated">
                    Yet to be evaluated
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col sm={8} md={6} lg={3}>
              <Form.Item {...restField} name={[name, "mockinterview"]}>
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col sm={8} md={6} lg={3}>
              <Form.Item {...restField} name={[name, "bestscore"]}>
                <Input />
              </Form.Item>
            </Col>
          </>
        ) : (
          <>
            <Col xs={24}>
              <Form.Item
                {...restField}
                name={[name, "trainingattended"]}
                label="Training Attended"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                {...restField}
                name={[name, "evaluationstatus"]}
                label="Evaluation Status"
                rules={[{ required: true, message: "Required" }]}
              >
                <Select>
                  <Option value="Completed">Completed</Option>
                  <Option value="Yet to be evaluated">
                    Yet to be evaluated
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={12}>
              <Form.Item
                {...restField}
                name={[name, "mockinterview"]}
                label="# of Interviews"
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={12}>
              <Form.Item
                {...restField}
                name={[name, "bestscore"]}
                label="Best Score"
              >
                <Input />
              </Form.Item>
            </Col>
          </>
        )}
        <Col
          xs={24}
          sm={8}
          md={6}
          lg={1}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => remove(name)}
          />
        </Col>
      </Row>
    </div>
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderInternshipFields = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { key, name, ...restField }: any,
    remove: (index: number) => void
  ) => (
    <div
      key={key}
      style={{
        marginBottom: 8,
        padding: 8,
        border: "1px solid #f0f0f0",
        borderRadius: 8,
      }}
    >
      {isMobile && (
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Internship</div>
      )}
      <Row gutter={[16, 8]}>
        <Col xs={24} sm={12} md={8} lg={5}>
          <Form.Item
            {...restField}
            name={[name, "role"]}
            label={isMobile ? "Role" : undefined}
            rules={[{ required: true, message: "Required" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        {!isMobile ? (
          <>
            <Col sm={6} md={4} lg={3}>
              <Form.Item
                {...restField}
                name={[name, "type"]}
                rules={[{ required: true, message: "Required" }]}
              >
                <Select>
                  <Option value="Onsite">Onsite</Option>
                  <Option value="Online">Online</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col sm={12} md={8} lg={5}>
              <Form.Item {...restField} name={[name, "organization"]}>
                <Input />
              </Form.Item>
            </Col>
            <Col sm={6} md={4} lg={3}>
              <Form.Item {...restField} name={[name, "duration"]}>
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col sm={6} md={4} lg={3}>
              <Form.Item
                {...restField}
                name={[name, "status"]}
                rules={[{ required: true, message: "Required" }]}
              >
                <Select>
                  <Option value="On going">On going</Option>
                  <Option value="Completed">Completed</Option>
                </Select>
              </Form.Item>
            </Col>
          </>
        ) : (
          <>
            <Col xs={24}>
              <Form.Item
                {...restField}
                name={[name, "type"]}
                label="Type"
                rules={[{ required: true, message: "Required" }]}
              >
                <Select>
                  <Option value="Onsite">Onsite</Option>
                  <Option value="Online">Online</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                {...restField}
                name={[name, "organization"]}
                label="Organization"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={12}>
              <Form.Item
                {...restField}
                name={[name, "duration"]}
                label="Duration (Months)"
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={12}>
              <Form.Item
                {...restField}
                name={[name, "status"]}
                label="Status"
                rules={[{ required: true, message: "Required" }]}
              >
                <Select>
                  <Option value="On going">On going</Option>
                  <Option value="Completed">Completed</Option>
                </Select>
              </Form.Item>
            </Col>
          </>
        )}
        <Col
          xs={24}
          sm={8}
          md={6}
          lg={1}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => remove(name)}
          />
        </Col>
      </Row>
    </div>
  );

  return (
    <Drawer
      title="Skills"
      placement="right"
      onClose={handleClose}
      open={open}
      width={"80%"}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={getInitialValues()}
      >
        {/* TECHNICAL SKILLS */}
        <Form.List name="techSkills">
          {(fields, { add, remove }) => (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <div style={{ fontWeight: 600 }}>Technical Skills</div>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => add()}
                ></Button>
              </div>
              <Divider style={{ marginTop: 0 }} />
              {fields.length > 0 && !isMobile && renderTechSkillHeaders()}
              {fields.map((field) => renderTechSkillFields(field, remove))}
            </>
          )}
        </Form.List>

        {/* SOFT SKILLS */}
        <Form.List name="softSkills">
          {(fields, { add, remove }) => (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginTop: 24,
                }}
              >
                <div style={{ fontWeight: 600 }}>Soft Skills</div>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => add()}
                ></Button>
              </div>
              <Divider style={{ marginTop: 0 }} />
              {fields.length > 0 && !isMobile && renderSoftSkillHeaders()}
              {fields.map((field) => renderSoftSkillFields(field, remove))}
            </>
          )}
        </Form.List>

        {/* INTERNSHIPS */}
        <Form.List name="internship">
          {(fields, { add, remove }) => (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginTop: 24,
                }}
              >
                <div style={{ fontWeight: 600 }}>Internships</div>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => add()}
                ></Button>
              </div>
              <Divider style={{ marginTop: 0 }} />
              {fields.length > 0 && !isMobile && renderInternshipHeaders()}
              {fields.map((field) => renderInternshipFields(field, remove))}
            </>
          )}
        </Form.List>

        {/* ACTION BUTTONS */}
        <Form.Item style={{ marginTop: 24 }}>
          <Space>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
            <Button onClick={handleClose}>Back</Button>
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default SkillsDrawer;
