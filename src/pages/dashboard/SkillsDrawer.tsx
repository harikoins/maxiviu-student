import React, { useEffect } from "react";
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
  Upload,
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
import { createBulkCertificate } from "../../services/certificationService";

const apiUrl = import.meta.env.VITE_API_URL;

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

      certifications:
        student.certificates?.map((certification) => ({
          name: certification.name,
          mode: certification.mode,
          certifiedBy: certification.certifiedBy,
          description: certification.description,
          certificateFile: certification.certificatePath
            ? {
                uid: `-${certification.id}`,
                name: certification.filename,
                status: "done",
                url: `${apiUrl}/${certification.certificatePath}`,
                certificatePath: certification.certificatePath, // Keep original path
              }
            : null,
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
    console.log(values, "values");
    try {
      const {
        internship = [],
        softSkills = [],
        techSkills = [],
        certifications = [],
      } = values;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const requests: Promise<any>[] = [];

      // 1. Handle Internships

      const internshipData = internship.map((item: internshipType) => ({
        role: item.role,
        type: item.type,
        organization: item.organization || null,
        duration: item.duration || null,
        status: item.status,
        student_id: student.id,
      }));
      requests.push(
        createBulkInternship({
          internshipDatas: internshipData,
          student_id: student.id,
        })
      );

      // 2. Handle Soft Skills

      const softSkillsData = softSkills.map((item: softSkillType) => ({
        skill: item.skill,
        trainingattended: item.trainingattended || null, // Match backend field
        evaluationstatus: item.evaluationstatus,
        mockinterview: item.mockinterview || 0,
        bestscore: item.bestscore || null,
        student_id: student.id,
      }));
      requests.push(
        createBulkSoftSkill({
          softSkillDatas: softSkillsData,
          student_id: student.id,
        })
      );

      // 3. Handle Technical Skills

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
        createBulkTechnicalSkill({
          technicalSkillDatas: techSkillsData,
          student_id: student.id,
        })
      );

      // 4. Handle Certifications (with file upload)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // 4. Handle Certifications (with bulk file upload)
      const formData = new FormData();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let fileUploadIndex = 0;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const certificationDatas = certifications.map((cert: any) => {
        let certificateFilePath = null;
        let certificateFileFlag = null;
        let fileIndex = null;

        if (cert.certificateFile?.originFileObj) {
          // New file, add to FormData
          formData.append("files", cert.certificateFile.originFileObj);
          certificateFilePath = "";
          certificateFileFlag = "";
          fileIndex = fileUploadIndex++; // Track current file's index in req.files
        } else if (cert.certificateFile?.certificatePath) {
          // Existing file
          certificateFilePath = cert.certificateFile.certificatePath;
          certificateFileFlag = cert.certificateFile.certificatePath;
        }

        return {
          name: cert.name,
          mode: cert.mode,
          certifiedBy: cert.certifiedBy,
          description: cert.description || "",
          student_id: student.id,
          certificateFile: certificateFileFlag,
          certificateFilePath,
          fileIndex, // <- Important
        };
      });

      // Append array as JSON
      formData.append("certificationDatas", JSON.stringify(certificationDatas));
      formData.append("student_id", student.id.toString());

      requests.push(createBulkCertificate(formData));

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

  const renderCertificationsHeaders = () => (
    <Row gutter={[16, 8]} style={{ marginBottom: 8, padding: "0 8px" }}>
      {/* Name */}
      <Col xs={24} sm={12} md={8} lg={6}>
        <div style={{ fontWeight: 500 }}>Name of the Certification</div>
      </Col>

      {!isMobile && (
        <>
          {/* Mode */}
          <Col sm={6} md={4} lg={3}>
            <div style={{ fontWeight: 500 }}>Mode</div>
          </Col>

          {/* Certified By */}
          <Col sm={12} md={8} lg={4}>
            <div style={{ fontWeight: 500 }}>Certified By</div>
          </Col>

          {/* Description */}
          <Col sm={24} md={12} lg={6}>
            <div style={{ fontWeight: 500 }}>Description</div>
          </Col>

          {/* Certificate Upload */}
          <Col sm={12} md={6} lg={4}>
            <div style={{ fontWeight: 500 }}>Certificate</div>
          </Col>
        </>
      )}

      {/* Action (Delete) - Aligned to match the delete button position */}
      <Col
        xs={24}
        sm={8}
        md={6}
        lg={1}
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
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

  const renderCertificationFields = (
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
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Certification</div>
      )}
      <Row gutter={[16, 8]}>
        {/* Certification Name */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item
            {...restField}
            name={[name, "name"]}
            label={isMobile ? "Certification Name" : undefined}
            rules={[{ required: true, message: "Required" }]}
          >
            <Input placeholder="e.g., AWS Certified Developer" />
          </Form.Item>
        </Col>

        {!isMobile ? (
          <>
            {/* Mode */}
            <Col sm={6} md={4} lg={3}>
              <Form.Item
                {...restField}
                name={[name, "mode"]}
                rules={[{ required: true, message: "Required" }]}
              >
                <Select placeholder="Mode">
                  <Option value="Online">Online</Option>
                  <Option value="Offline">Offline</Option>
                  <Option value="Hybrid">Hybrid</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Certified By */}
            <Col sm={12} md={8} lg={4}>
              <Form.Item
                {...restField}
                name={[name, "certifiedBy"]}
                rules={[{ required: true, message: "Required" }]}
              >
                <Input placeholder="Certified by (e.g., AWS, Microsoft)" />
              </Form.Item>
            </Col>

            {/* Description */}
            <Col sm={24} md={12} lg={6}>
              <Form.Item {...restField} name={[name, "description"]}>
                <Input.TextArea placeholder="Description (optional)" />
              </Form.Item>
            </Col>

            {/* Certificate Upload */}
            <Col sm={12} md={6} lg={4}>
              <Form.Item {...restField} name={[name, "certificateFile"]}>
                <Upload
                  accept=".pdf,.jpg,.png,.jpeg"
                  maxCount={1}
                  beforeUpload={() => false}
                  listType="picture-card"
                  fileList={
                    form.getFieldValue([
                      "certifications",
                      name,
                      "certificateFile",
                    ])
                      ? [
                          form.getFieldValue([
                            "certifications",
                            name,
                            "certificateFile",
                          ]),
                        ]
                      : []
                  }
                  onChange={({ fileList }) => {
                    const newFileList = fileList.slice(-1); // Only keep the last file
                    form.setFieldsValue({
                      certifications: [
                        ...form.getFieldValue("certifications").slice(0, name),
                        {
                          ...form.getFieldValue(["certifications", name]),
                          certificateFile: newFileList[0] || null,
                        },
                        ...form.getFieldValue("certifications").slice(name + 1),
                      ],
                    });
                  }}
                >
                  {form.getFieldValue([
                    "certifications",
                    name,
                    "certificateFile",
                  ]) ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
                
              </Form.Item>
            </Col>
          </>
        ) : (
          <>
            {/* Mobile View */}
            <Col xs={24}>
              <Form.Item
                {...restField}
                name={[name, "mode"]}
                label="Mode"
                rules={[{ required: true, message: "Required" }]}
              >
                <Select placeholder="Mode">
                  <Option value="Online">Online</Option>
                  <Option value="Offline">Offline</Option>
                  <Option value="Hybrid">Hybrid</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                {...restField}
                name={[name, "certifiedBy"]}
                label="Certified By"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input placeholder="Certified by (e.g., AWS, Microsoft)" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                {...restField}
                name={[name, "description"]}
                label="Description"
              >
                <Input.TextArea placeholder="Description (optional)" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                {...restField}
                name={[name, "certificateFile"]}
                label="Certificate"
              >
                <Upload
                  accept=".pdf,.jpg,.png,.jpeg"
                  maxCount={1}
                  beforeUpload={() => false}
                  listType="picture-card"
                  fileList={
                    form.getFieldValue([
                      "certifications",
                      name,
                      "certificateFile",
                    ])
                      ? [
                          form.getFieldValue([
                            "certifications",
                            name,
                            "certificateFile",
                          ]),
                        ]
                      : []
                  }
                  onChange={({ fileList }) => {
                    const newFileList = fileList.slice(-1);
                    form.setFieldsValue({
                      certifications: [
                        ...form.getFieldValue("certifications").slice(0, name),
                        {
                          ...form.getFieldValue(["certifications", name]),
                          certificateFile: newFileList[0] || null,
                        },
                        ...form.getFieldValue("certifications").slice(name + 1),
                      ],
                    });
                  }}
                >
                  {form.getFieldValue([
                    "certifications",
                    name,
                    "certificateFile",
                  ]) ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
               
              </Form.Item>
            </Col>
          </>
        )}

        {/* Delete Button */}
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

        {/* CERTIFICATIONS */}
        <Form.List name="certifications">
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
                <div style={{ fontWeight: 600 }}>Certifications</div>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => add()}
                ></Button>
              </div>
              <Divider style={{ marginTop: 0 }} />
              {fields.length > 0 && !isMobile && renderCertificationsHeaders()}
              {fields.map((field) => renderCertificationFields(field, remove))}
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
